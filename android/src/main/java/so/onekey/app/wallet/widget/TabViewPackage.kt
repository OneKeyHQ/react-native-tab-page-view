package so.onekey.app.wallet.widget

import com.facebook.react.uimanager.ViewManager
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import so.onekey.app.wallet.viewManager.homePage.HomePageManager
import so.onekey.app.wallet.selectedLabel.SelectedLabelViewManager

class TabViewPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> =
        emptyList()

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> =
        listOf(
            HomePageManager(),
            SelectedLabelViewManager()
        )
}
