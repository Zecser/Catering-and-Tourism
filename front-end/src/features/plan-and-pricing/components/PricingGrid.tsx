import { FaInfoCircle } from "react-icons/fa";
import { usePlanPackage } from "../hooks/usePlanPackage";
import PricingCard from "./PricingCard";
import PricingCardSkeleton from "./PricingCardSkeleton";
import { useState } from "react";
import { type PlanPricingType } from "../type";
import PricingPlanDialog from "./PricingPlanDialog";
import Header from "./Header";
import { Plus } from "lucide-react";
import { DeleteAlertDialog } from "./DeleteDialog";
import ApplyPlanDialog from "./AppyPlanDialog";

const PricingGrid = () => {
  const {
    error,
    isLoading,
    pricing,
    createPlan,
    updatePlan,
    isAdmin,
    isSaving,
    deletePlan,
  } = usePlanPackage();

  const [selectedPlan, setSelectedPlan] = useState<PlanPricingType | boolean>(
    false
  );

  const [selectedApplyPlan, setSelectedApplyPlan] = useState<PlanPricingType>();

  const [selectedDeletePlan, setSelectedDeletePlan] =
    useState<PlanPricingType>();

  const onSave = async (
    data: Omit<PlanPricingType, "_id">
  ): Promise<boolean> => {
    if (typeof selectedPlan === "boolean") {
      return await createPlan(data);
    } else if (selectedPlan?._id) {
      return await updatePlan(data, selectedPlan._id);
    }
    return false;
  };

  if (isLoading) {
    return (
      <div className="text-center text-white max-w-6xl mx-auto">
        <Header isAdmin={isAdmin} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[30px] mt-6">
          {[...Array(3)].map((_, idx) => (
            <PricingCardSkeleton key={idx} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 max-w-6xl mx-auto p-4">
        <p>Oops! Something went wrong: {error}</p>
      </div>
    );
  }

  return (
    <div className="text-center text-white max-w-6xl mx-auto">
      <Header isAdmin={isAdmin} />
      {(!pricing || pricing.length === 0) && !isAdmin ? (
        <div className="text-center text-white max-w-6xl mt-10 mx-auto p-4 font-light">
          <p>
            <FaInfoCircle className="inline-block mr-2 text-yellow-400 text-2xl" />
            No pricing plans available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[30px] mt-6">
          {pricing.map((plan) => (
            <PricingCard
              onEdit={isAdmin ? () => setSelectedPlan(plan) : undefined}
              key={plan._id}
              onDelete={isAdmin ? () => setSelectedDeletePlan(plan) : undefined}
              {...plan}
              onBuy={() => setSelectedApplyPlan(plan)}
            />
          ))}
          {isAdmin && (
            <div
              onClick={() => setSelectedPlan(true)}
              className="bg-gradient-to-tl cursor-pointer opacity-70 to-[#992183] from-[#601B53] rounded-xl space-y-4 flex flex-col h-full border border-white/30 p-10 items-center justify-center min-h-96"
            >
              <p>ADD NEW PLAN</p>
              <Plus size={100} />
            </div>
          )}
        </div>
      )}
      <PricingPlanDialog
        isSaving={isSaving}
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(false)}
        onSave={onSave}
        initialPlanData={selectedPlan}
      />
      <DeleteAlertDialog
        isOpen={!!selectedDeletePlan}
        itemName={selectedDeletePlan?.title || ""}
        onDelete={async () => await deletePlan(selectedDeletePlan?._id!)}
        onOpenChange={() => setSelectedDeletePlan(undefined)}
      />

      <ApplyPlanDialog
      onClose={()=>setSelectedApplyPlan(undefined)}
      plan={selectedApplyPlan} />
    </div>
  );
};

export default PricingGrid;
