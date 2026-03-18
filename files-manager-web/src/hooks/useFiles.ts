import { useQuery } from "@tanstack/react-query";
import { browseFiles } from "../api/filesApi";

export const useFiles = (path?: string) => {
    return useQuery({
        queryKey: ['files', path],
        queryFn: () => browseFiles(path),
        staleTime: 5000,
    });
};
