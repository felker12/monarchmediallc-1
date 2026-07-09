export interface ProjectItem {
    id: number;
    title: string;
    description: string;
    techStack: string | null;
    liveUrl: string | null;
    imagePath: string | null;
    imageAlt: string | null;
    package: number; //Maps to PackageType enum integers (0 = Core, 1 = Professional, 2 = Premium)
    featured: boolean;
    displayOrder: number;
    completedOn: string | null;
    isPublic: boolean;
    industry: number;
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