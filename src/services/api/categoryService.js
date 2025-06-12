import { toast } from 'react-toastify';

export const categoryService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ['Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'color', 'icon', 'order'],
        orderBy: [
          {
            fieldName: 'order',
            SortType: 'ASC'
          }
        ]
      };

      const response = await apperClient.fetchRecords('category', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Handle empty or non-existent data
      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Map database fields to UI format
      return response.data.map(category => ({
        id: category.Id.toString(),
        name: category.Name || '',
        color: category.color || '#5B67CA',
        icon: category.icon || 'Folder',
        order: category.order || 0
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ['Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'color', 'icon', 'order']
      };

      const response = await apperClient.getRecordById('category', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error('Category not found');
      }

      // Map database fields to UI format
      const category = response.data;
      return {
        id: category.Id.toString(),
        name: category.Name || '',
        color: category.color || '#5B67CA',
        icon: category.icon || 'Folder',
        order: category.order || 0
      };
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      throw error;
    }
  },

  async create(categoryData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // CRITICAL: Only include fields with visibility: "Updateable"
      const params = {
        records: [{
          Name: categoryData.name || '',
          color: categoryData.color || '#5B67CA',
          icon: categoryData.icon || 'Folder',
          order: categoryData.order || 0
        }]
      };

      const response = await apperClient.createRecord('category', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${failedRecords}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to create category');
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord && successfulRecord.data) {
          const category = successfulRecord.data;
          return {
            id: category.Id.toString(),
            name: category.Name || '',
            color: category.color || '#5B67CA',
            icon: category.icon || 'Folder',
            order: category.order || 0
          };
        }
      }
      
      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // CRITICAL: Only include fields with visibility: "Updateable" plus Id
      const updateData = {
        Id: parseInt(id)
      };

      if (updates.name !== undefined) updateData.Name = updates.name;
      if (updates.color !== undefined) updateData.color = updates.color;
      if (updates.icon !== undefined) updateData.icon = updates.icon;
      if (updates.order !== undefined) updateData.order = updates.order;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('category', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${failedRecords}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to update category');
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord && successfulRecord.data) {
          const category = successfulRecord.data;
          return {
            id: category.Id.toString(),
            name: category.Name || '',
            color: category.color || '#5B67CA',
            icon: category.icon || 'Folder',
            order: category.order || 0
          };
        }
      }
      
      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('category', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${failedRecords}`);
          
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to delete category');
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }
};