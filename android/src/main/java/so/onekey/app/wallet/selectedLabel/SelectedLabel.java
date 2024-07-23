package so.onekey.app.wallet.selectedLabel;

import android.content.Context;
import android.graphics.Typeface;
import android.os.Build;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import android.widget.TextView;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.views.text.ReactFontManager;

public class SelectedLabel extends TextView {

    public int normalColor;

    public int selectedColor;

    public float selectedScale;

    public int fontWeight;

    public float fontSize;

    public int fontStyle;

    public String fontFamily;

    private static int[] convertColor(int color) {
        int alpha = (color >> 24) & 0xFF;
        int red = (color >> 16) & 0xFF;
        int green = (color >> 8) & 0xFF;
        int blue = color & 0xFF;
        return new int[]{ alpha, red, green, blue };
    }

    private static int packColor(int[] colorList) {
        return (colorList[0] << 24) + (colorList[1] << 16) + (colorList[2] << 8) + colorList[3];
    }

    private static int appendColor(int normalColor, int selectedColor, float progress) {
        int[] normalColorList = convertColor(normalColor);
        int[] selectedColorList = convertColor(selectedColor);
        int[] reloadColorList = new int[]{ 1, 0, 0, 0 };
        for (int i = 0; i < 4; i ++) {
            reloadColorList[i] = normalColorList[i] + (int)((selectedColorList[i] - normalColorList[i]) * progress);
        }
        return packColor(reloadColorList);
    }

    public SelectedLabel(Context context) {
        super(context);
    }

    public void reloadContentSize() {
        if (fontSize != getTextSize()) {
            Typeface typeface = ReactFontManager.getInstance().getTypeface(this.fontFamily, this.fontStyle, this.fontWeight, getContext().getAssets());
            setTypeface(typeface);
        }
        float scale = 1;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
            scale = this.getScaleX();
        }
        float progress = (scale - 1) / (selectedScale - 1);
        setTextColor(appendColor(normalColor, selectedColor, progress));


        if (getLayoutParams() == null) {
            setLayoutParams(new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        }
        measure(
            MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED),
            MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED)
        );
        final int measuredWidth = getMeasuredWidth();
        final int measuredHeight = getMeasuredHeight();
        if (measuredWidth != getWidth() || measuredHeight != getHeight()) {
            final ReactContext reactContext = (ReactContext) getContext();
            reactContext.runOnNativeModulesQueueThread(new Runnable() {
                @Override
                public void run() {
                    reactContext.getNativeModule(UIManagerModule.class)
                        .updateNodeSize(getId(), measuredWidth, measuredHeight);
                }
            });
        }



    }

}
