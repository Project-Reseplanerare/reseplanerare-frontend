import { create } from "zustand";

interface SubItem {
    id: number;
    title: string;
    lat: number | null;
    lng: number | null;
}

interface Category {
    id: number;
    label: string;
    subItems: SubItem[];
}

interface CategoryState {
    categories: Category[];
    filteredCategories: Category[];
    selectedCategory: string | null;
    isLoading: boolean;
    error: string | null;
    fetchCategories: () => Promise<void>;
    filterCategoriesByBounds: (bounds: { north: number, south: number, east: number, west: number }) => void;
    setSelectedCategory: (category: string | null) => void;
}

const CATEGORIES_API = "https://turid.visitvarmland.com/api/v8/categories";

export const useCategoryStore = create<CategoryState>((set, get) => ({
    categories: [],
    filteredCategories: [],
    selectedCategory: null,
    isLoading: false,
    error: null,
  
    fetchCategories: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(CATEGORIES_API);
        if (!response.ok) throw new Error("Failed to fetch categories");
  
        const data = await response.json();
        if (!data || !data.data) throw new Error("No data received from API");
  
        const mainCategories = data.data.filter((category: any) => category.parent === 1);
        const formattedCategories = mainCategories.map((category: any) => ({
          id: category.id,
          label: category.title,
          subItems: category.children?.map((child: any) => ({
            id: child.id,
            title: child.title,
            lat: child.latitude ? parseFloat(child.latitude) : null,
            lng: child.longitude ? parseFloat(child.longitude) : null
          })) || []
        }));
  
        set({ categories: formattedCategories, filteredCategories: formattedCategories, isLoading: false });
      } catch (error) {
        console.error("Error fetching categories:", error);
        set({ error: error instanceof Error ? error.message : "Unknown error", isLoading: false });
      }
    },
  
    filterCategoriesByBounds: (bounds) => {
      const { categories } = get();
  
      const filtered = categories
        .map(category => ({
          ...category,
          subItems: category.subItems.filter(subItem =>
            subItem.lat !== null && subItem.lng !== null &&
            subItem.lat >= bounds.south && subItem.lat <= bounds.north &&
            subItem.lng >= bounds.west && subItem.lng <= bounds.east
          )
        }))
        .filter(category => category.subItems.length > 0);
  
      set({ filteredCategories: filtered });
    },
  
    setSelectedCategory: (category: string | null) => {
      set({ selectedCategory: category });
    }
  }));
