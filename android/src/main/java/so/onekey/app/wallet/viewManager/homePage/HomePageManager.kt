package so.onekey.app.wallet.viewManager.homePage

import android.util.Log
import android.view.View
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.uimanager.UIManagerHelper.getReactContext
import so.onekey.app.wallet.extensions.getBooleanOrNull
import so.onekey.app.wallet.extensions.getIntOrNull
import so.onekey.app.wallet.extensions.getStringOrNull
import so.onekey.app.wallet.viewManager.homePage.event.PageSelectedEvent
import so.onekey.app.wallet.viewManager.homePage.event.SwipeRefreshEvent
import so.onekey.app.wallet.viewManager.homePage.event.PageScrollStateChangeEvent
import javax.annotation.Nullable

data class TabProps(
    var name: String,
    var label: String,
)

class HomePageManager : ViewGroupManager<HomePageView>() {
    companion object {
        const val COMMAND_SET_PAGE_INDEX = 1
        const val COMMAND_SET_REFRESHING = 2
        const val COMMAND_SET_VERTICAL_SCROLL_ENABLED = 3
    }

    private val REACT_CLASS = "NestedTabView"

    override fun getName() = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext): HomePageView {
        Log.d("HomePageManager", "createViewInstance")
        return HomePageView(reactContext).also {
            it.isSaveEnabled = false
            val activity = getReactContext(it).currentActivity
            if (activity is FragmentActivity) {
                it.setViewPager(activity)
            }
        }
    }

    @ReactProp(name = "headerHeight")
    fun setHeaderHeight(view: HomePageView, @Nullable height: Int?) {
        height?.let { view.setHeaderHeight(height) }
    }

    @ReactProp(name = "disableRefresh")
    fun setDisableRefresh(view: HomePageView, disable: Boolean) {
        view.setEnableRefresh(!disable)
    }

    @ReactProp(name = "scrollEnabled")
    fun setScrollEnabled(view: HomePageView, @Nullable enable: Boolean?) {
        view.setScrollEnabled(enable ?: false)
    }

    @ReactProp(name = "tabViewStyle")
    fun setTabViewStyle(view: HomePageView?, style: ReadableMap?) {
        style?.apply {
            val paddingX = getIntOrNull("paddingX") ?: 0
            val tabHeight = getInt("height")

            val activeLabelColor = getString("activeLabelColor")
            val labelColor = getString("labelColor")

            val tabSpaceEqual = getBooleanOrNull("tabSpaceEqual") ?: true
            val indicatorColor = getString("indicatorColor")
            val backgroundColor = getString("backgroundColor")
            val bottomLineColor = getStringOrNull("bottomLineColor")

            val labelStyle = getMap("labelStyle")
            val fontFamily = labelStyle?.getString("fontFamily")
            val fontWeight = labelStyle?.getString("fontWeight")
            val fontSize = labelStyle?.getInt("fontSize")
            val lineHeight = labelStyle?.getInt("lineHeight")

            view?.setTabViewStyle(
                paddingX,
                tabHeight,
                tabSpaceEqual,
                activeLabelColor,
                labelColor,
                indicatorColor,
                backgroundColor,
                bottomLineColor,
                fontFamily,
                fontWeight,
                fontSize,
                lineHeight
            )
        }
    }

    @ReactProp(name = "values")
    fun setTabs(view: HomePageView, @Nullable tabs: ReadableArray?) {
        tabs?.let {
            val list = mutableListOf<TabProps>()
            for (i in 0 until tabs.size()) {

                val tab = tabs.getMap(i)
                val name = tab?.getString("name")
                val label = tab?.getString("label")

                if (name != null && label != null) {
                    list.add(TabProps(name, label))
                }
            }
            view.setTabs(list)
        }
    }

    @ReactProp(name = "slideDisable")
    fun setSlideDisable(view: HomePageView, disable: Boolean?) {
        view.setSlideDisable(disable)
    }

    @ReactProp(name = "refresh")
    fun setRefresh(view: HomePageView, refresh: Boolean) {
        view.setRefresh(refresh)
    }

    @ReactProp(name = "showToolBar")
    fun showToolBar(view: HomePageView, refresh: Boolean) {
        view.showToolBar(refresh)
    }

    override fun getExportedCustomBubblingEventTypeConstants(): Map<String, Any> {
        return mapOf(
            PageSelectedEvent.EVENT_NAME to mapOf(
                "phasedRegistrationNames" to mapOf("bubbled" to "onPageChange")
            ),
            SwipeRefreshEvent.EVENT_NAME to mapOf(
                "phasedRegistrationNames" to mapOf("bubbled" to "onRefreshCallBack")
            ),
            PageScrollStateChangeEvent.EVENT_NAME to mapOf(
                "phasedRegistrationNames" to mapOf("bubbled" to "onPageScrollStateChange")
            )
        )
    }

    override fun getCommandsMap(): Map<String, Int> {
        return mapOf(
            "setPageIndex" to COMMAND_SET_PAGE_INDEX,
            "setRefreshing" to COMMAND_SET_REFRESHING,
            "setVerticalScrollEnabled" to COMMAND_SET_VERTICAL_SCROLL_ENABLED
        )
    }

    override fun receiveCommand(view: HomePageView, commandId: Int, args: ReadableArray?) {
        super.receiveCommand(view, commandId, args)
        when (commandId) {
            COMMAND_SET_PAGE_INDEX -> if (args != null) {
                val pageIndex: Int = args.getInt(0)
                view.setCurrentIndex(pageIndex)
            }

            COMMAND_SET_REFRESHING -> if (args != null) {
                val refresh = args.getBoolean(0)
                view.setRefresh(refresh)
            }

            COMMAND_SET_VERTICAL_SCROLL_ENABLED -> if (args != null) {
                val enabled = args.getBoolean(0)
                view.setVerticalScrollEnabled(enabled)
            }
        }
    }

    override fun getChildCount(parent: HomePageView): Int {
        return parent.getChildViewCount()
    }

    override fun getChildAt(parent: HomePageView, index: Int): View? {
        return parent.getChildViewAt(index)
    }

    // props change
    override fun onAfterUpdateTransaction(view: HomePageView) {
        super.onAfterUpdateTransaction(view)
        view.updateTabsTitle()
    }

    override fun addView(parent: HomePageView, child: View, index: Int) {
        parent.addChildView(child, index)
    }

    override fun addViews(parent: HomePageView, views: MutableList<View>) {
        views?.forEachIndexed { index, view ->
            addView(parent, view, index)
        }
    }

    override fun removeViewAt(parent: HomePageView, index: Int) {
        parent.removeChildViewAt(index)
    }

    override fun removeView(parent: HomePageView, view: View) {
        parent.removeChildView(view)
    }

    override fun removeAllViews(parent: HomePageView?) {
        if (parent == null) return
        for (i in 0 until parent.getChildViewCount()) {
            parent.removeChildViewAt(i)
        }
    }

    override fun needsCustomLayoutForChildren(): Boolean {
        return true
    }
}
