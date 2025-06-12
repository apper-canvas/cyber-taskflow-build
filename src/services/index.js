import { taskService } from './api/taskService';
import { categoryService } from './api/categoryService';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export { taskService, categoryService, delay };