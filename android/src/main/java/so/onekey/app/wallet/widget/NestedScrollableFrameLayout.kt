package so.onekey.app.wallet.widget

import android.content.Context
import android.util.AttributeSet
import android.view.MotionEvent
import android.widget.FrameLayout
import com.facebook.react.uimanager.events.NativeGestureUtil

class NestedScrollableFrameLayout @JvmOverloads constructor(
    context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0
) : FrameLayout(context, attrs, defStyleAttr) {
    private var initialX = 0f
    private var initialY = 0f

    override fun onInterceptTouchEvent(ev: MotionEvent): Boolean {
        when (ev.action) {
            MotionEvent.ACTION_DOWN -> {
                initialX = ev.x
                initialY = ev.y
            }
            MotionEvent.ACTION_MOVE -> {
                val diffX = ev.x - initialX
                val diffY = ev.y - initialY
                if (Math.abs(diffX) > Math.abs(diffY)) {
                    NativeGestureUtil.notifyNativeGestureStarted(this, ev);
                }
            }
        }
        return super.onInterceptTouchEvent(ev)
    }

    override fun onTouchEvent(ev: MotionEvent): Boolean {
        when (ev.action) {
            MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                NativeGestureUtil.notifyNativeGestureEnded(this, ev);
            }
        }
        return super.onTouchEvent(ev);
    }

}