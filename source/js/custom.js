/* 自定义脚本 */

(() => {
  const bannerVideoSrc = '/video/banner-smoke-cover.mp4'

  function mountHomeBannerVideo() {
    const header = document.getElementById('page-header')

    if (!header || !header.classList.contains('full_page')) return
    if (header.querySelector('.home-banner-video')) return

    const video = document.createElement('video')
    video.className = 'home-banner-video'
    video.src = bannerVideoSrc
    video.autoplay = true
    video.loop = false
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'
    video.setAttribute('aria-hidden', 'true')
    video.setAttribute('muted', '')
    video.setAttribute('playsinline', '')
    video.addEventListener('ended', () => {
      video.pause()
    }, { once: true })

    header.prepend(video)

    const play = video.play()
    if (play && typeof play.catch === 'function') {
      play.catch(() => {
        video.remove()
      })
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountHomeBannerVideo)
  } else {
    mountHomeBannerVideo()
  }

  document.addEventListener('pjax:complete', mountHomeBannerVideo)
})()
