import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import AdminPage from "../../components/AdminPage"
import { useSettings } from "../../hooks/useSettings"
import { trpc } from "../../utils/trpc"
import { Settings } from "@prisma/client"

const SettingsPage = () => {
  const { data: settings } = useSettings()
  const { register, reset, handleSubmit } = useForm<Settings>()
  const { mutate } = trpc.useMutation(["settings.updateSettings"], {
    onSuccess: () => {
      toast.success("Settings updated")
    },
  })

  useEffect(() => {
    if (settings) {
      reset(settings)
    }
  }, [settings, reset])

  const update = (values: Settings) => {
    mutate({
      data: {
        ...values,
        registration_bonus:
          Number(values.registration_bonus) ||
          settings?.registration_bonus ||
          0,
        referral_commision:
          Number(values.referral_commision) ||
          settings?.referral_commision ||
          3,
        bkash_percentage:
          Number(values.bkash_percentage) || settings?.bkash_percentage || 2,
        cashout_notice: values.cashout_notice || undefined,
        app_download_link: values.app_download_link || undefined,
        min_withdraw:
          Number(values.min_withdraw) || settings?.min_withdraw || 500,
        min_deposit: Number(values.min_deposit) || settings?.min_deposit || 500,
        max_withdraw:
          Number(values.max_withdraw) || settings?.max_withdraw || 500,
      },
    })
  }
  return (
    <AdminPage>
      <form onSubmit={handleSubmit(update)}>
        <div className="w-full max-w-md mx-auto flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label>bKash Number</label>
            <input
              type="text"
              placeholder="bKash Number"
              {...register("bkash")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Nagad Number</label>
            <input
              type="text"
              placeholder="Nagad Number"
              {...register("nagad")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Whatsapp Number</label>
            <input
              type="text"
              placeholder="Whatsapp Number"
              {...register("whatsapp_number")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Telegram Link</label>
            <input
              type="text"
              placeholder="Telegram Link"
              {...register("telegram_link")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Registration Bonus</label>
            <input
              type="text"
              placeholder="Registration Bonus"
              {...register("registration_bonus")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Referral Commision % </label>
            <input
              type="number"
              placeholder="Referral Commision"
              {...register("referral_commision", { required: true })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Withdraw Fees % </label>
            <input
              type="number"
              placeholder="Withdraw Fees"
              {...register("bkash_percentage", { required: true })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Minimum Cash out</label>
            <input
              type="number"
              placeholder="Minimum Cash out"
              {...register("min_withdraw", { required: true })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Maximum Cash out</label>
            <input
              type="number"
              placeholder="Maximum Cash out"
              {...register("max_withdraw", { required: true })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Minimum Deposit</label>
            <input
              type="number"
              placeholder="Minimum deposit"
              {...register("min_deposit", { required: true })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="cashout_enabled">Cashout Notice</label>
            <input
              type="text"
              id="cashout_notice"
              {...register("cashout_notice")}
            />
          </div>

          <div className="hidden flex-col gap-2">
            <label htmlFor="cashout_enabled">App Download Link</label>
            <input
              type="text"
              id="app_download_link"
              {...register("app_download_link")}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="cashout_enabled"
              {...register("cashout_enabled")}
            />
            <label htmlFor="cashout_enabled">Allow Cashout</label>
          </div>

          <div>
            <button
              type="submit"
              className="px-7 py-3 bg-black text-white rounded-md"
            >
              Save Settings
            </button>
          </div>
        </div>
      </form>
    </AdminPage>
  )
}

export default SettingsPage
