export interface SiteImageItem {
    id: number;
    fileName: string;
    storagePath: string;
    altText: string | null;
    publicUrl: string;
    createdAtUtc: string;
}

export interface ProjectItem {
    id: number;
    title: string;
    description: string;
    techStack: string | null;
    liveUrl: string | null;

    //DB relation mapping for site image
    siteImageId: number | null;
    siteImage: SiteImageItem | null;
    imageAlt: string | null; // Available if mapped explicitly via ToDto() extension layers

    package: number; // Maps to PackageType enum integers (0 = Core, 1 = Professional, 2 = Premium)
    featured: boolean;
    displayOrder: number;
    completedOn: string | null;
    isPublic: boolean;
    industry: number; // Maps to Industry enum integers
    clientName: string | null;
}

export interface Database {
    public: {
        Tables: {
            MMLLC_Projects: {
                Row: ProjectItem;
            };
        };
    };
}


