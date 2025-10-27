import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAdmin } from "./useAdmin";

export const useAdminLoader = () => {
  const { loading, checked, admin } = useAdmin();
  const [showLoader, setShowLoader] = useState(true);
  const [minDurationPassed, setMinDurationPassed] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setMinDurationPassed(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && checked && minDurationPassed) {
      setShowLoader(false);
    }
  }, [loading, checked, minDurationPassed]);

  return {
    admin,
    loading,
    checked,
    showLoader: showLoader && pathname.includes("admin"),
  };
};
