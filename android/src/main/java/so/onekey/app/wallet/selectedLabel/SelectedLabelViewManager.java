package so.onekey.app.wallet.selectedLabel;

import android.graphics.Typeface;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ReactStylesDiffMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewProps;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.text.ReactTypefaceUtils;

import javax.annotation.Nullable;

public class SelectedLabelViewManager extends SimpleViewManager<SelectedLabel> {

    @NonNull
    @Override
    public String getName() {
        return "SelectedLabel";
    }

    @NonNull
    @Override
    protected SelectedLabel createViewInstance(@NonNull ThemedReactContext reactContext) {
        SelectedLabel selectedLabel = new SelectedLabel(reactContext);
        return selectedLabel;
    }

    @ReactProp(name = "normalColor", customType = "Color")
    public void setNormalColor(SelectedLabel view, int normalColor) {
        view.normalColor = normalColor;
    }

    @ReactProp(name = "selectedColor", customType = "Color")
    public void setSelectedColor(SelectedLabel view, int selectedColor) {
        view.selectedColor = selectedColor;
    }

    @ReactProp(name = "selectedScale")
    public void setSelectedScale(SelectedLabel view, float selectedScale) {
        view.selectedScale = selectedScale;
    }

    @ReactProp(name = "text")
    public void setText(SelectedLabel view, String text) {
        view.setText(text);
    }





    @ReactProp(name = ViewProps.FONT_SIZE, defaultFloat = Float.NaN)
    public void setFontSize(SelectedLabel view, float fontSize) {
        view.setTextSize(fontSize);
    }

    @ReactProp(name = ViewProps.FONT_FAMILY)
    public void setFontFamily(SelectedLabel view, @Nullable String fontFamily) {
        view.fontFamily = fontFamily;
    }

    @ReactProp(name = ViewProps.FONT_WEIGHT)
    public void setFontWeight(SelectedLabel view, @Nullable String fontWeightString) {
        view.fontWeight = ReactTypefaceUtils.parseFontWeight(fontWeightString);
    }

    @ReactProp(name = ViewProps.FONT_STYLE)
    public void setFontStyle(SelectedLabel view, @Nullable String fontStyleString) {
        view.fontStyle = ReactTypefaceUtils.parseFontStyle(fontStyleString);
    }

    @Override
    public void updateProperties(@NonNull SelectedLabel viewToUpdate, ReactStylesDiffMap props) {
        super.updateProperties(viewToUpdate, props);
        viewToUpdate.reloadContentSize();
    }
}
