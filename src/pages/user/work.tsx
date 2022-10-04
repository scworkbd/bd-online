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
      {ad && (
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
      )}

      {start && <Timer />}
      {!start && (
        <h1 className="text-2xl font-bold text-center py-10 text-red-500">
          Play the video to complete work
        </h1>
      )}
    </DashPage>
  )
}

export default Work
