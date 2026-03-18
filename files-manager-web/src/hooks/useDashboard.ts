import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "../api/dashboardApi";

export function useDashboard() {
    return useQuery({
        queryKey: ["dashboard"],
        queryFn: getDashboardData
    });
}