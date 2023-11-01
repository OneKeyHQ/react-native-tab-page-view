//
//  SelectedLabel.m
//  react-native-selectedlabel
//
//  Created by hublot on 2020/11/2.
//

#import "SelectedLabel.h"
#import <React/RCTFont.h>

@interface SelectedLabel ()

@property (nonatomic, assign) CGFloat progress;

@end

@implementation SelectedLabel

+ (NSArray *)convertColor:(UIColor *)color {
    CGFloat red = 0;
    CGFloat green = 0;
    CGFloat blue = 0;
    CGFloat alpha = 1;
    [color getRed:&red green:&green blue:&blue alpha:&alpha];
    return @[@(red), @(green), @(blue), @(alpha)];
}

+ (UIColor *)appendColor:(UIColor *)normalColor selectedColor:(UIColor *)selectedColor progress:(CGFloat)progress {
    NSArray *normalColorList = [self convertColor:normalColor];
    NSArray *selectedColorList = [self convertColor:selectedColor];
    NSMutableArray *reloadColor = [@[@(0), @(0), @(0), @(1)] mutableCopy];
    for (int i = 0; i < 4; i ++) {
        reloadColor[i] = [NSNumber numberWithDouble:[normalColorList[i] doubleValue] + ([selectedColorList[i] doubleValue] - [normalColorList[i] doubleValue]) * progress];
    }
    return [UIColor colorWithRed:[reloadColor[0] doubleValue] green:[reloadColor[1] doubleValue] blue:[reloadColor[2] doubleValue] alpha:[reloadColor[3] doubleValue]];
}

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        _selectedScale = 1;
        self.layer.shouldRasterize = true;
        self.lineBreakMode = NSLineBreakByClipping;
    }
    return self;
}

- (void)setNormalColor:(UIColor *)normalColor {
    _normalColor = normalColor;
    [self reloadContentSize];
}

- (void)setSelectedColor:(UIColor *)selectedColor {
    _selectedColor = selectedColor;
    [self reloadContentSize];
}

- (void)setSelectedScale:(CGFloat)selectedScale {
    _selectedScale = selectedScale;
    [self reloadContentSize];
}

- (void)setText:(NSString *)text {
    [super setText:text];
    [self reloadContentSize];
}

- (void)setFont:(UIFont *)font {
    [super setFont:font];
    [self reloadContentSize];
}

- (void)reloadTransform3D:(CATransform3D)transform {
    self.layer.transform = transform;
    [self reloadContentSize];
}




- (void)reloadContentSize {
    CGFloat progress = (self.layer.transform.m11 - 1) / (self.selectedScale - 1);
    self.textColor = [[self class] appendColor:self.normalColor selectedColor:self.selectedColor progress:progress];
    CGSize contentSize = [self sizeThatFits:CGSizeMake(CGFLOAT_MAX, CGFLOAT_MAX)];
    CGSize size = self.bounds.size;
    if (size.width * size.height != 0 && !CGSizeEqualToSize(size, CGSizeZero)) {
        contentSize = [self sizeThatFits:size];
    }
    if (size.width != contentSize.width || size.height != contentSize.height) {
        [self.bridge.uiManager setIntrinsicContentSize:contentSize forView:self];
    }
}


@end
