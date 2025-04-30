import { useForm } from "react-hook-form";
import { Button } from "../components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hours } from "../lib/constants";
import {
  createEvent,
  deleteEvent,
  updateEvent,
} from "@/Calendar/calendar.queries";
import { CalendarEvent } from "@/lib/types";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

export const Header = ({
  selectedEvent,
  onEventSelected,
}: {
  selectedEvent: CalendarEvent | null;
  onEventSelected: (event: CalendarEvent | null) => void;
}) => {
  const queryClient = useQueryClient();
  const [hasTimeError, setHasTimeError] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const loadingToastIdRef = useRef<string | number | null>(null);

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Please enter a name",
    }),
    startTime: z.string({
      required_error: "Please select a start time",
    }),
    endTime: z.string({
      required_error: "Please select an end time",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      startTime: undefined,
      endTime: undefined,
    },
  });

  const {
    mutate: createOrUpdateEvent,
    isPending,
    status,
  } = useMutation({
    mutationFn: (data: { id?: string; values: Omit<CalendarEvent, "id"> }) => {
      if (data.id) {
        return updateEvent(data.id, data.values);
      }
      return createEvent(data.values);
    },
    onSuccess: () => {
      if (loadingToastIdRef.current) {
        toast.dismiss(loadingToastIdRef.current);
        loadingToastIdRef.current = null;
      }
      toast.success("Event saved successfully");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      resetForm();
    },
    onError: (error: Error) => {
      if (loadingToastIdRef.current) {
        toast.dismiss(loadingToastIdRef.current);
        loadingToastIdRef.current = null;
      }
      toast.error("Error saving event");
      console.error("Error saving event:", error);
    },
  });

  const {
    mutate: removeEvent,
    isPending: isDeleting,
    status: deleteStatus,
  } = useMutation({
    mutationFn: (id: string) => {
      return deleteEvent(id);
    },
    onSuccess: () => {
      if (loadingToastIdRef.current) {
        toast.dismiss(loadingToastIdRef.current);
        loadingToastIdRef.current = null;
      }
      toast.success("Event deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      resetForm();
    },
    onError: (error: Error) => {
      if (loadingToastIdRef.current) {
        toast.dismiss(loadingToastIdRef.current);
        loadingToastIdRef.current = null;
      }
      toast.error("Error deleting event");
      console.error("Error deleting event:", error);
    },
  });

  useEffect(() => {
    if (isPending && !loadingToastIdRef.current) {
      loadingToastIdRef.current = toast.loading("Saving event...");
    } else if (isDeleting && !loadingToastIdRef.current) {
      loadingToastIdRef.current = toast.loading("Deleting event...");
    } else if (!isPending && !isDeleting && loadingToastIdRef.current) {
      toast.dismiss(loadingToastIdRef.current);
      loadingToastIdRef.current = null;
    }

    return () => {
      if (loadingToastIdRef.current) {
        toast.dismiss(loadingToastIdRef.current);
        loadingToastIdRef.current = null;
      }
    };
  }, [isPending, isDeleting]);

  useEffect(() => {
    if (selectedEvent) {
      form.reset({
        name: selectedEvent.name,
        startTime: selectedEvent.startTime,
        endTime: selectedEvent.endTime,
      });
    } else {
      form.reset({
        name: "",
        startTime: undefined,
        endTime: undefined,
      });
    }
  }, [selectedEvent, form]);

  useEffect(() => {
    const startTime = form.getValues("startTime");
    const endTime = form.getValues("endTime");

    if (!startTime || !endTime) {
      setHasTimeError(false);
      return;
    }

    const startIndex = hours.findIndex((h) => h.value === startTime);
    const endIndex = hours.findIndex((h) => h.value === endTime);

    setHasTimeError(startIndex >= 0 && endIndex >= 0 && startIndex >= endIndex);
  }, [form.watch("startTime"), form.watch("endTime"), form]);

  const resetForm = () => {
    form.reset({
      name: "",
      startTime: undefined,
      endTime: undefined,
    });

    form.clearErrors();
    setHasTimeError(false);
    onEventSelected(null);

    setFormKey((prev) => prev + 1);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const startIndex = hours.findIndex((h) => h.value === values.startTime);
    const endIndex = hours.findIndex((h) => h.value === values.endTime);

    if (startIndex >= endIndex) {
      setHasTimeError(true);
      return;
    }

    createOrUpdateEvent({
      id: selectedEvent?.id,
      values,
    });
  };

  const handleDelete = () => {
    if (selectedEvent) {
      removeEvent(selectedEvent.id);
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  const getSubmitButtonText = () => {
    if (status === "pending") return "Saving...";
    if (selectedEvent) return "Update Event";
    return "Add Event";
  };

  const getDeleteButtonText = () => {
    if (deleteStatus === "pending") return "Deleting...";
    return "Delete";
  };

  const formattedDate = format(new Date(), "MMMM d, yyyy");

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">{formattedDate}</h1>
        <Form {...form} key={formKey}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex gap-4 items-end"
          >
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    key={`start-${formKey}`}
                    disabled={isPending || isDeleting}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select a start time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {hours.map((hour) => (
                        <SelectItem key={hour.id} value={hour.value}>
                          {hour.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    key={`end-${formKey}`}
                    disabled={isPending || isDeleting}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select an end time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {hours.map((hour) => (
                        <SelectItem key={hour.id} value={hour.value}>
                          {hour.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {hasTimeError && (
                    <p className="text-sm text-red-500 mt-1">
                      End time must be after start time
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Event name"
                      {...field}
                      className="w-[220px]"
                      disabled={isPending || isDeleting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-black hover:bg-gray-800"
              disabled={
                hasTimeError ||
                !form.formState.isValid ||
                isPending ||
                isDeleting
              }
            >
              {getSubmitButtonText()}
            </Button>

            {selectedEvent && (
              <>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isPending || isDeleting}
                >
                  {getDeleteButtonText()}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isPending || isDeleting}
                >
                  Cancel
                </Button>
              </>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};
