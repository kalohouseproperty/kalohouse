"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPendingPropertiesForAdmin, verifyProperty } from "@/app/actions/properties";
import { PropertyApprovalModal } from "@/components/dashboard/PropertyApprovalModal";
import { cn } from "@/lib/utils";
import { PropertyWizard } from "@/components/forms/PropertyWizard";
import Image from "next/image";

interface PendingProperty {
  id: number;
  title: string;
  description: string;
  district: string;
  sector: string;
  owner_price: number;
  commission_rate: number;
  commission_amount: number;
  final_display_price: number;
  size_sq_m: number | null;
  latitude: number | null;
  longitude: number | null;
  property_type: string;
  owner?: {
    id: number;
    full_name: string | null;
    email: string;
  };
  owner_phone: string | null;
  media?: Array<{ url: string }>;
  [key: string]: any; // Allow other fields from server
}

export default function AdminPropertiesPage() {
  const [pendingProperties, setPendingProperties] = useState<PendingProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<PendingProperty | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [openWizard, setOpenWizard] = useState(false);

  const loadPendingProperties = async () => {
    try {
      setLoading(true);
      const properties = await getPendingPropertiesForAdmin();
      console.log('[AdminProperties] Loaded properties:', {
        count: properties.length,
        firstProperty: properties[0] ? {
          id: properties[0].id,
          title: properties[0].title,
          mediaCount: properties[0].media?.length || 0,
          firstMediaUrl: properties[0].media?.[0]?.url,
        } : null
      });
      setPendingProperties(properties);
    } catch (error) {
      console.error('[AdminProperties] Error loading pending properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingProperties();
  }, []);

  const handleApprove = async (propertyId: number) => {
    try {
      setIsApproving(true);
      await verifyProperty(propertyId, true);
      setPendingProperties(pendingProperties.filter(p => p.id !== propertyId));
    } catch (error) {
      console.error('Error approving property:', error);
      alert('Failed to approve property');
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectClick = (property: PendingProperty) => {
    setSelectedProperty(property);
    setShowRejectionModal(true);
  };

  const handleConfirmReject = async (reason: string) => {
    if (!selectedProperty) return;
    try {
      setIsApproving(true);
      await verifyProperty(selectedProperty.id, false, undefined, reason);
      setPendingProperties(pendingProperties.filter(p => p.id !== selectedProperty.id));
      setShowRejectionModal(false);
      setSelectedProperty(null);
    } catch (error) {
      console.error('Error rejecting property:', error);
      alert('Failed to reject property');
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <DashboardShell title="Properties" role="admin">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-serif text-white mb-2">Property Approvals</h2>
            <p className="text-muted-text text-sm">
              Review and approve submitted properties. You have {pendingProperties.length} pending properties.
            </p>
          </div>
          <Button onClick={() => setOpenWizard(true)}>Submit property</Button>
        </div>

        {loading ? (
          <Card className="glass-card p-6">
            <p className="text-muted-text text-center py-8">Loading pending properties...</p>
          </Card>
        ) : pendingProperties.length === 0 ? (
          <Card className="glass-card p-6">
            <p className="text-muted-text text-center py-8">No pending properties to review</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingProperties.map((property) => (
              <Card key={property.id} className="glass-card overflow-hidden hover:bg-white/5 transition">
                <div className="p-6 flex gap-6">
                  {/* Property Image */}
                  <div className="w-40 h-40 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                    {(property.media && property.media.length > 0 && property.media[0]?.url) ? (
                        <Image
                        src={property.media[0].url}
                        alt={property.title}
                        width={160}
                        height={160}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                        console.error('Failed to load image:', property.media![0].url);
                        (e.target as HTMLImageElement).style.display = 'none';
                        }}
                        />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gold/10 to-gold/5 flex items-center justify-center">
                        <span className="text-muted-text text-sm">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Property Details */}
                  <div className="flex-1">
                    <div className="mb-4 flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{property.title}</h3>
                        <p className="text-muted-text text-sm line-clamp-1">{property.district} • {property.sector}</p>
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        property.status === "Pending Verification" 
                          ? "bg-warning/10 text-warning border-warning/20" 
                          : "bg-info/10 text-info border-info/20"
                      )}>
                        {property.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm mb-6">
                      <div className="space-y-1">
                        <p className="text-[10px] text-muted-text uppercase font-black tracking-widest">Price</p>
                        <p className="text-gold font-bold text-lg">{Number(property.owner_price).toLocaleString()} RWF</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-muted-text uppercase font-black tracking-widest">Owner</p>
                        <p className="text-white font-medium">{property.owner?.full_name || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-muted-text uppercase font-black tracking-widest">Type</p>
                        <p className="text-white font-medium">{property.property_type}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-muted-text uppercase font-black tracking-widest">Contact</p>
                        <p className="text-white font-medium text-xs">{property.owner_phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 justify-end">
                    <Button 
                      onClick={() => handleApprove(property.id)}
                      disabled={isApproving}
                      className="bg-gold/20 text-gold hover:bg-gold/30 border border-gold/50"
                    >
                      ✓ Approve
                    </Button>
                    <Button 
                      onClick={() => handleRejectClick(property)}
                      disabled={isApproving}
                      className="bg-red-900/20 text-red-400 hover:bg-red-900/30 border border-red-900/50"
                    >
                      ✕ Reject
                    </Button>
                    <Button 
                      onClick={() => window.location.href = `/properties/${property.id}`}
                      variant="ghost"
                      size="sm"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectionModal && selectedProperty && (
        <PropertyApprovalModal
          property={selectedProperty as any}
          onConfirm={handleConfirmReject}
          onCancel={() => {
            setShowRejectionModal(false);
            setSelectedProperty(null);
          }}
          isLoading={isApproving}
        />
      )}

      {openWizard ? (
        <PropertyWizard
          onClose={() => setOpenWizard(false)}
          onSuccess={() => {
            setOpenWizard(false);
            loadPendingProperties();
          }}
        />
      ) : null}
    </DashboardShell>
  );
}
