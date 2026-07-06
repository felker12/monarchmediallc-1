export interface ProjectItem {
    id: number;
    created_at: string;
    project_name: string;
    client_name: string | null;
    tech_stack: string | null;
    live_url: string | null;
    img_path: string | null;
    img_alt_text: string | null;
    display_order: number | null;
    featured: boolean;
    visible: boolean;
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