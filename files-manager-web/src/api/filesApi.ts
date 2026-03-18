import api from "./apiClient";

// Temporary interface until DirectoryContentsDto is available in generated models
export interface DirectoryContentsDto {
    currentPath?: string;
    items?: FileItemDto[];
}

export interface FileItemDto {
    name?: string;
    path?: string;
    isDirectory?: boolean;
    size?: number;
    extension?: string;
    lastModified?: Date | string;
}

export const browseFiles = async (path?: string): Promise<DirectoryContentsDto> => {
    const queryParams = new URLSearchParams();
    
    if (path) {
        queryParams.append('path', path);
    }
    
    const url = `/api/files/browse${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const { data } = await api.get<DirectoryContentsDto>(url);
    return data;
};
