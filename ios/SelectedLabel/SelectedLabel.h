//
//  SelectedLabel.h
//  react-native-selectedlabel
//
//  Created by hublot on 2020/11/2.
//

#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>

NS_ASSUME_NONNULL_BEGIN

@interface SelectedLabel : UILabel

@property (nonatomic, weak) RCTBridge *bridge;

@property (nonatomic, strong) UIColor *normalColor;

@property (nonatomic, strong) UIColor *selectedColor;

@property (nonatomic, assign) CGFloat selectedScale;

- (void)reloadTransform3D:(CATransform3D)transform;

@end

NS_ASSUME_NONNULL_END
