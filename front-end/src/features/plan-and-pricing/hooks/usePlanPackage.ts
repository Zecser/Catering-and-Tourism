import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import type { AppDispatch, RootState } from "../../../store";
import type { PlanPricingType } from "../type";
import api from "../../../lib/api";
import { extractErrorMessages } from "../../../utils/helpers/extractErrorMessages";

import {
  fetchPlansStart,
  fetchPlansSuccess,
  fetchPlansFailure,
  createPlanStart,
  createPlanSuccess,
  createPlanFailure,
  updatePlanStart,
  updatePlanSuccess,
  deletePlanSuccess,
} from "../../../store/pricingSlice";

export const usePlanPackage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pathname } = useLocation();
  const isAdmin = pathname.includes("/admin");

  const { pricing, isLoading, isSaving, isFetched, error } = useSelector(
    (state: RootState) => state.planPackage
  );
  
  const fetchPlans = async () => {
    try {
      dispatch(fetchPlansStart());
      const res = await api.get("/package");
      dispatch(fetchPlansSuccess(res.data || []));
    } catch (err) {
      dispatch(fetchPlansFailure(extractErrorMessages(err)));
    }
  };

  useEffect(() => {
    if (!isFetched) {

      fetchPlans();
    }
  }, [dispatch, isFetched]);

  const createPlan = async (data: Omit<PlanPricingType, "_id">) => {
    try {
      dispatch(createPlanStart());
      const res = await api.post("/package", data);
      dispatch(createPlanSuccess(res.data));
      return true;
    } catch (err) {
      const msg = extractErrorMessages(err);
      toast.error(msg);
      dispatch(createPlanFailure(msg));
      return false;
    }
  };

  const updatePlan = async (data: Omit<PlanPricingType, "_id">, id: string) => {
    try {
      dispatch(updatePlanStart());
      const res = await api.put(`/package/${id}`, data);
      dispatch(updatePlanSuccess(res.data));
      return true;
    } catch (err) {
      const msg = extractErrorMessages(err);
      toast.error(msg);
      return false;
    }
  };

  const deletePlan = async (id: string) => {
    try {
      await api.delete(`/package/${id}`);
      dispatch(deletePlanSuccess(id));
    } catch (err) {
      const msg = extractErrorMessages(err);
      toast.error(msg);
    }
  };

  return {
    isLoading,
    pricing,
    error,
    createPlan,
    updatePlan,
    deletePlan,
    isSaving,
    isAdmin,
  };
};
