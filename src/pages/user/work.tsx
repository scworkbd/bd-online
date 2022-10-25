import React, { useEffect, useState } from "react"
import YouTube from "react-youtube"
import { useRouter } from "next/router"

import DashPage from "../../components/DashPage"
import Timer from "../../components/Timer"
import { trpc } from "../../utils/trpc"
import { toast } from "react-hot-toast"
import CustomToast from "../../components/CustomToast"

const Work = () => {
  const { data: works } = trpc.useQuery(["user.works"])
  const [start, setState] = useState(false)
  const router = useRouter()
  const ad = router.query.id

  useEffect(() => {
    if (works !== undefined && works <= 0) {
      toast.custom(<CustomToast message="আজকের লিমিট শেষ" />)
      router.push("/user/dashboard")
    }
  }, [works, router])
  return (
    <DashPage>
      <h1 className="text-2xl font-bold text-center text-rose-900 mb-5">
        ভিডিও
      </h1>
      {ad && (
        <div className="border-2 border-rose-700">
          <YouTube
            videoId={ad as string}
            id={ad as string}
            className="video-responsive"
            opts={{
              playerVars: {
                autoplay: 1,
                mute: 1,
              },
            }}
            onPlay={() => setState(true)}
            onPause={() => setState(false)}
          />
        </div>
      )}

      {start && <Timer />}
      {!start && (
        <h1 className="text-2xl font-bold text-center py-10 text-rose-900">
          ভিডিও টি প্লে করে ৫ সেকেন্ড অপেক্ষা করুন
        </h1>
      )}
    </DashPage>
  )
}

export default Work
