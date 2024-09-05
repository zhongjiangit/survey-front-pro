'use client';

import { Button } from '@/src/components/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { State, createInvoice } from '@/src/lib/actions';
import { CustomerField } from '@/src/lib/definitions';
import { zodResolver } from '@hookform/resolvers/zod';

import { CheckIcon, ClockIcon } from 'lucide-react';
import Link from 'next/link';
import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    message: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    message: 'Please select an invoice status.',
  }),
  date: z.string(),
});

export default function CreateForm({
  customers,
}: {
  customers: CustomerField[];
}) {
  const initialState: State = {
    message: null,
    errors: {},
  };

  const [state, formAction] = useActionState(createInvoice, initialState);

  // 1. Define your form.
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: undefined,
      customerId: undefined,
      amount: undefined,
      status: undefined,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof FormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    console.log(values);
    // formAction(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Choose customer</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
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
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Choose an amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter USD amount"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Set the invoice status</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-y-1 rounded-md border border-gray-200 bg-white px-[14px] py-3"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem
                          value="pending"
                          className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                        />
                      </FormControl>
                      <FormLabel className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                        Pending <ClockIcon className="h-4 w-4" />
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem
                          value="paid"
                          className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                        />
                      </FormControl>
                      <FormLabel className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white">
                        Paid <CheckIcon className="h-4 w-4" />
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/invoices"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <Button type="submit">Create Invoice</Button>
        </div>
      </form>
    </Form>
    // <form action={formAction}>
    //   <div className="rounded-md bg-gray-50 p-4 md:p-6">
    //     {/* Customer Name */}
    //     <div className="mb-4">
    //       <label htmlFor="customer" className="mb-2 block text-sm font-medium">
    //         Choose customer
    //       </label>
    //       <div className="relative">
    //         <select
    //           id="customer"
    //           name="customerId"
    //           className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
    //           defaultValue=""
    //           aria-describedby="customer-error"
    //         >
    //           <option value="" disabled>
    //             Select a customer
    //           </option>
    //           {customers.map(customer => (
    //             <option key={customer.id} value={customer.id}>
    //               {customer.name}
    //             </option>
    //           ))}
    //         </select>
    //         <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
    //       </div>
    //       <div id="customer-error" aria-live="polite" aria-atomic="true">
    //         {state.errors?.customerId &&
    //           state.errors.customerId.map((error: string) => (
    //             <p className="mt-2 text-sm text-red-500" key={error}>
    //               {error}
    //             </p>
    //           ))}
    //       </div>
    //     </div>

    //     {/* Invoice Amount */}
    //     <div className="mb-4">
    //       <label htmlFor="amount" className="mb-2 block text-sm font-medium">
    //         Choose an amount
    //       </label>
    //       <div className="relative mt-2 rounded-md">
    //         <div className="relative">
    //           <input
    //             id="amount"
    //             name="amount"
    //             type="number"
    //             step="0.01"
    //             placeholder="Enter USD amount"
    //             className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
    //             aria-describedby="amount-error"
    //           />
    //           <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    //         </div>
    //       </div>
    //       <div id="amount-error" aria-live="polite" aria-atomic="true">
    //         {state.errors?.amount &&
    //           state.errors.amount.map((error: string) => (
    //             <p className="mt-2 text-sm text-red-500" key={error}>
    //               {error}
    //             </p>
    //           ))}
    //       </div>
    //     </div>

    //     {/* Invoice Status */}
    //     <fieldset>
    //       <legend className="mb-2 block text-sm font-medium">
    //         Set the invoice status
    //       </legend>
    //       <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
    //         <div className="flex gap-4">
    //           <div className="flex items-center">
    //             <input
    //               id="pending"
    //               name="status"
    //               type="radio"
    //               value="pending"
    //               className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
    //               aria-describedby="status-error"
    //             />
    //             <label
    //               htmlFor="pending"
    //               className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
    //             >
    //               Pending <ClockIcon className="h-4 w-4" />
    //             </label>
    //           </div>
    //           <div className="flex items-center">
    //             <input
    //               id="paid"
    //               name="status"
    //               type="radio"
    //               value="paid"
    //               className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
    //               aria-describedby="status-error"
    //             />
    //             <label
    //               htmlFor="paid"
    //               className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
    //             >
    //               Paid <CheckIcon className="h-4 w-4" />
    //             </label>
    //           </div>
    //         </div>
    //       </div>
    //       <div id="status-error" aria-live="polite" aria-atomic="true">
    //         {state.errors?.status &&
    //           state.errors.status.map((error: string) => (
    //             <p className="mt-2 text-sm text-red-500" key={error}>
    //               {error}
    //             </p>
    //           ))}
    //       </div>
    //     </fieldset>
    //     <div id="message" aria-live="polite" aria-atomic="true">
    //       {state.message && (
    //         <p className="mt-2 text-sm text-red-500">{state.message}</p>
    //       )}
    //     </div>
    //   </div>
    //   <div className="mt-6 flex justify-end gap-4">
    //     <Link
    //       href="/dashboard/invoices"
    //       className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
    //     >
    //       Cancel
    //     </Link>
    //     <Button type="submit">Create Invoice</Button>
    //   </div>
    // </form>
  );
}
