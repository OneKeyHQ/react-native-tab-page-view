//
//  SelectedLabelManager.m
//  react-native-selectedlabel
//
//  Created by hublot on 2020/11/2.
//

#import "SelectedLabelManager.h"
#import "SelectedLabel.h"
#import <React/RCTUIManager.h>
#import <React/RCTFont.h>
#import <React/RCTConvert+Transform.h>
#import <React/RCTImageShadowView.h>

@interface SelectedLabelManager ()

@end

@implementation SelectedLabelManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(normalColor, UIColor)

RCT_EXPORT_VIEW_PROPERTY(selectedColor, UIColor)

RCT_EXPORT_VIEW_PROPERTY(text, NSString)

RCT_EXPORT_VIEW_PROPERTY(selectedScale, CGFloat)

RCT_CUSTOM_VIEW_PROPERTY(fontSize, NSNumber, SelectedLabel) {
    view.font = [RCTFont updateFont:view.font withSize:json ?: @(defaultView.font.pointSize)];
}
RCT_CUSTOM_VIEW_PROPERTY(fontWeight, NSString, SelectedLabel) {
    view.font = [RCTFont updateFont:view.font withWeight:json];
}
RCT_CUSTOM_VIEW_PROPERTY(fontStyle, NSString, SelectedLabel) {
    view.font = [RCTFont updateFont:view.font withStyle:json];
}
RCT_CUSTOM_VIEW_PROPERTY(fontFamily, NSString, SelectedLabel) {
    view.font = [RCTFont updateFont:view.font withFamily:json ?: defaultView.font.familyName];
}

RCT_CUSTOM_VIEW_PROPERTY(transform, CATransform3D, SelectedLabel) {
    [view reloadTransform3D:json ? [RCTConvert CATransform3D:json] : defaultView.layer.transform];
}

- (SelectedLabel *)view {
    SelectedLabel *selectedLabel = [[SelectedLabel alloc] initWithFrame:CGRectZero];
    selectedLabel.bridge = self.bridge;
    return selectedLabel;
}

@end
