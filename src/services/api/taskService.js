import { toast } from 'react-toastify';

export const taskService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ['Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'completed', 'priority', 'category_id', 'due_date', 'created_at', 'order'],
        orderBy: [
          {
            fieldName: 'order',
            SortType: 'ASC'
          }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);
      
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
      return response.data.map(task => ({
        id: task.Id,
        title: task.title || task.Name || '',
        completed: task.completed || false,
        priority: task.priority || 'medium',
        categoryId: task.category_id ? task.category_id.toString() : null,
        dueDate: task.due_date || null,
        createdAt: task.created_at || task.CreatedOn || new Date().toISOString(),
        order: task.order || 0
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
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
        fields: ['Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'completed', 'priority', 'category_id', 'due_date', 'created_at', 'order']
      };

      const response = await apperClient.getRecordById('task', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error('Task not found');
      }

      // Map database fields to UI format
      const task = response.data;
      return {
        id: task.Id,
        title: task.title || task.Name || '',
        completed: task.completed || false,
        priority: task.priority || 'medium',
        categoryId: task.category_id ? task.category_id.toString() : null,
        dueDate: task.due_date || null,
        createdAt: task.created_at || task.CreatedOn || new Date().toISOString(),
        order: task.order || 0
      };
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // CRITICAL: Only include fields with visibility: "Updateable"
      const params = {
        records: [{
          title: taskData.title || '',
          completed: taskData.completed || false,
          priority: taskData.priority || 'medium',
          category_id: taskData.categoryId ? parseInt(taskData.categoryId) : null,
          due_date: taskData.dueDate || null,
          order: taskData.order || 0
        }]
      };

      const response = await apperClient.createRecord('task', params);
      
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
          throw new Error('Failed to create task');
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord && successfulRecord.data) {
          const task = successfulRecord.data;
          return {
            id: task.Id,
            title: task.title || '',
            completed: task.completed || false,
            priority: task.priority || 'medium',
            categoryId: task.category_id ? task.category_id.toString() : null,
            dueDate: task.due_date || null,
            createdAt: task.created_at || task.CreatedOn || new Date().toISOString(),
            order: task.order || 0
          };
        }
      }
      
      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error("Error creating task:", error);
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

      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.completed !== undefined) updateData.completed = updates.completed;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.categoryId !== undefined) updateData.category_id = updates.categoryId ? parseInt(updates.categoryId) : null;
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
      if (updates.order !== undefined) updateData.order = updates.order;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('task', params);
      
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
          throw new Error('Failed to update task');
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord && successfulRecord.data) {
          const task = successfulRecord.data;
          return {
            id: task.Id,
            title: task.title || '',
            completed: task.completed || false,
            priority: task.priority || 'medium',
            categoryId: task.category_id ? task.category_id.toString() : null,
            dueDate: task.due_date || null,
            createdAt: task.created_at || task.CreatedOn || new Date().toISOString(),
            order: task.order || 0
          };
        }
      }
      
      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error("Error updating task:", error);
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

      const response = await apperClient.deleteRecord('task', params);
      
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
          throw new Error('Failed to delete task');
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }
};