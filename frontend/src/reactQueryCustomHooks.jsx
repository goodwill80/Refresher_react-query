import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import customFetch from './util';
import { toast } from 'react-toastify';

// Fetch all tasks
export const useFetchTasks = () => {
  // Query
  const { isLoading, data, error, isError } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => customFetch.get('/'),
  });

  return { isLoading, data, error, isError };
};

// Post new task
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  // Create Task
  const { mutate: createTask, isLoading } = useMutation({
    mutationFn: (taskTitle) => customFetch.post('/', { title: taskTitle }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('task added');
    },
    onError: (error) => {
      toast.error(error.response.data.msg);
    },
  });
  return { createTask, isLoading };
};

// Edit task
export const useEditTask = () => {
  const queryClient = useQueryClient();
  const { mutate: editTask } = useMutation({
    mutationFn: ({ taskId, isDone }) => {
      return customFetch.patch(`/${taskId}`, { isDone });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return { editTask };
};

// Delete task
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { mutate: deleteTask, isLoading: deleteTaskLoading } = useMutation({
    mutationFn: ({ taskId }) => {
      return customFetch.delete(`/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return { deleteTask, deleteTaskLoading };
};
