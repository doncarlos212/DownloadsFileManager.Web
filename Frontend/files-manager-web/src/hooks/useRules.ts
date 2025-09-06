import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IRuleDto } from "../api/generated";
import { addRule, deleteRule, getRule, getRules, updateRule } from "../api/rulesApi";
import { useSnackBar } from "../contexts/SnackBarContext";


export function useRules() {  
    return useQuery<IRuleDto[]>({
        queryKey: ["rules"],
        queryFn: getRules    
    });
}

export function useRule(id?: string){
  return useQuery<IRuleDto>({
    queryKey: ["rules", id],
    queryFn: () => {
      if (!id) {
        return Promise.reject(new Error("No rule id provided"));
      }
      return getRule(id);
    },
    enabled: !!id
  })
}

export function useAddRule() {
  const snackBar = useSnackBar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addRule,
    onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["rules"]})        
        snackBar.showSnackBar('Rule added successfully', 'success');
    }
  });
}

export function useUpdateRule() {
  const snackBar = useSnackBar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRule,
    onSuccess: (updatedRule, variables) => {
      const ruleToStore = (updatedRule && typeof updatedRule === 'object') ? updatedRule : variables;
      queryClient.setQueryData<IRuleDto[] | undefined>(["rules"], (old) => {
        if (!old) return old;
        // IMPORTANTE: crear SIEMPRE un nuevo objeto para la fila actualizada
        return old.map(r => (r.id === ruleToStore.id ? { ...r, ...ruleToStore } : r));
      });
      queryClient.invalidateQueries({ queryKey: ["rules"], refetchType: "active" });
      snackBar.showSnackBar('Rule updated successfully', 'success');
    }
  });
}

export function useDeleteRule() {
  const snackBar = useSnackBar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rules"] });
      snackBar.showSnackBar('Rule deleted successfully', 'success');
    }
  });
}
