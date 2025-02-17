const BASE_API = 'https://turid.visitvarmland.com/api/v8/products';

const fetchProductsByCategory = async (category: string, limit: number, page: number) => {
    try {
        const response = await fetch(`${BASE_API}?categories=${category}&limit=${limit}&page=${page}`);
        if (!response.ok) throw new Error(`Failed to fetch ${category}`);

        const data = await response.json();
        return data.data.map((product: any) => ({
            lat: parseFloat(product.latitude) || 0,
            lng: parseFloat(product.longitude) || 0,
            title: product.name || 'Unknown Product',
            description: product.description || 'No description available',
        }));
    } catch (error) {
        console.error(`Error fetching ${category}:`, error);
        return [];
    }
};

export const fetchFoodDrinks = async (limit: number, page: number) => {
    return fetchProductsByCategory('mat-dryck', limit, page);
};

export const fetchCultureHistory = async (limit: number, page: number) => {
    return fetchProductsByCategory('kultur-historia', limit, page);
};

export const fetchDesignShopping = async (limit: number, page: number) => {
    return fetchProductsByCategory('design-shopping', limit, page);
};

export const fetchAccommodation = async (limit: number, page: number) => {
    return fetchProductsByCategory('boende', limit, page);
};

export const fetchActivities = async (limit: number, page: number) => {
    return fetchProductsByCategory('aktiviteter', limit, page);
};
