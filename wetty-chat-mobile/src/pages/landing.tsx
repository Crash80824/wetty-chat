import {
    IonBadge,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonPage,
    IonSegment,
    IonSegmentButton,
    IonText,
    IonTitle,
    IonToolbar,
} from '@ionic/react';
import {type ReactNode, useState} from 'react';
import {
    arrowForward, ellipsisHorizontal,
    ellipsisVertical,
    logoApple,
    logoChrome,
    logoEdge,
    logoWindows,
    menuOutline, shareOutline
} from 'ionicons/icons';
import './landing.scss';

type PlatformId = 'android' | 'ios' | 'windows' | 'macos' | 'linux';

const platformOptions: Array<{ id: PlatformId; label: string }> = [
    {id: 'android', label: 'Android'},
    {id: 'ios', label: 'iOS'},
    {id: 'windows', label: 'Windows'},
    {id: 'macos', label: 'macOS'},
    {id: 'linux', label: 'Linux'},
];

function MenuDots() {
    return (
        <IonIcon className="landing-inline-icon" icon={ellipsisVertical}/>
    );
}

function InlineLink({
                        href,
                        icon,
                        children,
                    }: {
    href?: string;
    icon: string;
    children: ReactNode;
}) {
    const className = href ? 'landing-inline-link' : 'landing-inline-link landing-inline-link--muted';

    if (!href) {
        return (
            <span className={className}>
        <IonIcon icon={icon}/>
        <span>{children}</span>
      </span>
        );
    }

    return (
        <a className={className} href={href} target="_blank" rel="noreferrer">
            <IonIcon icon={icon}/>
            <span>{children}</span>
        </a>
    );
}

const detectPlatform = (): PlatformId => {
    const ua = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();

    if (/iphone|ipad|ipod/.test(ua)) {
        return 'ios';
    }
    if (/android/.test(ua)) {
        return 'android';
    }
    if (platform.includes('win')) {
        return 'windows';
    }
    if (platform.includes('mac')) {
        return 'macos';
    }
    if (platform.includes('linux') || /x11/.test(ua)) {
        return 'linux';
    }

    return 'android';
};

export default function LandingPage() {
    const detectedPlatform = detectPlatform();
    const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>(detectedPlatform);

    return (
        <IonPage>
            <IonHeader translucent={true}>
                <IonToolbar>
                    <IonTitle>安装 Wetty Chat</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen={true} className="landing-page">
                <section className="landing-hero">
                    <div className="landing-hero__copy">
                        <IonBadge color="primary">PWA Install Guide</IonBadge>
                        <h1>把 Wetty Chat 放到你的主屏幕上</h1>
                        <p>安装后可以像原生应用一样从桌面、Dock 或任务栏直接启动，打开更快，也更顺手。</p>
                        <div className="landing-hero__actions">
                            <IonButton routerLink="/chats" shape="round">
                                直接进入聊天
                                <IonIcon slot="end" icon={arrowForward}/>
                            </IonButton>
                            <IonButton fill="clear" shape="round" href="#platform-guides">
                                查看安装步骤
                            </IonButton>
                        </div>
                    </div>
                </section>

                <section className="landing-grid" id="platform-guides">
                    <IonSegment
                        value={selectedPlatform}
                        scrollable={true}
                        className="landing-platform-segment"
                        onIonChange={(event) => {
                            const nextPlatform = event.detail.value;
                            if (
                                nextPlatform === 'android' ||
                                nextPlatform === 'ios' ||
                                nextPlatform === 'windows' ||
                                nextPlatform === 'macos' ||
                                nextPlatform === 'linux'
                            ) {
                                setSelectedPlatform(nextPlatform);
                            }
                        }}
                    >
                        {platformOptions.map((option) => (
                            <IonSegmentButton key={option.id} value={option.id}>
                                {option.label}
                            </IonSegmentButton>
                        ))}
                    </IonSegment>

                    <IonCard
                        className={selectedPlatform === detectedPlatform ? 'landing-card landing-card--active' : 'landing-card'}>
                        {selectedPlatform === 'android' && (
                            <>
                {/*<IonCardHeader>*/}
                {/*  <IonCardSubtitle>*/}
                {/*    使用{' '}*/}
                {/*    <InlineLink href="https://play.google.com/store/apps/details?id=com.android.chrome" icon={logoChrome}>*/}
                {/*      Google Chrome 浏览器*/}
                {/*    </InlineLink>*/}
                {/*    。若无法使用，也可以改用 <InlineLink icon={logoWindows}>Edge</InlineLink>。*/}
                {/*  </IonCardSubtitle>*/}
                {/*</IonCardHeader>*/}
                    <IonCardContent>
                        <ol className="landing-card__steps">
                            <li>
                                使用
                                <InlineLink href="https://play.google.com/store/apps/details?id=com.android.chrome"
                                            icon={logoChrome}>
                                    Chrome 浏览器
                                </InlineLink>
                                访问本页
                            </li>
                            <li>
                                点击 <MenuDots/> 菜单
                            </li>
                            <li>选择“添加到主屏幕”，然后点“安装”</li>
                            <li>确认安装，之后即可从桌面直接打开</li>
                        </ol>
                        <IonText color="medium">
                            <p className="landing-card__note">
                                如果无法使用 Chrome，也可以用
                                <InlineLink href="https://play.google.com/store/apps/details?id=com.android.chrome"
                                            icon={logoEdge}>
                                    Edge 浏览器
                                </InlineLink>
                                <br/>
                                点击 <IonIcon className="landing-inline-icon" icon={menuOutline}/> 菜单，选择“添加至手机”
                                (在第二页)。
                            </p>
                            <p className="landing-card__note">
                                如果浏览器主动弹出了安装界面，直接点安装即可。
                            </p>
                        </IonText>
                    </IonCardContent>
                            </>
                        )}

                        {selectedPlatform === 'ios' && (
                            <IonCardContent>
                                <ol className="landing-card__steps">
                                    <li>
                                        使用 <InlineLink icon={logoApple}>Safari</InlineLink> 访问本页
                                    </li>
                                    <li>点击 <IonIcon className="landing-inline-icon"
                                                      icon={ellipsisHorizontal}/> 菜单，选择 <IonIcon
                                        className="landing-inline-icon" icon={shareOutline}/> “分享”。
                                    </li>
                                    <li>选择 “添加到主屏幕” (可能会藏在 “查看更多” 里面)</li>
                                    <li>确认添加，之后即可从桌面直接打开</li>
                                </ol>
                            </IonCardContent>
                        )}

                        {selectedPlatform === 'windows' && (
                            <>
                                <IonCardContent>
                                    <ol className="landing-card__steps">
                                        <li>
                                            在 <InlineLink icon={logoWindows}>Edge</InlineLink> 中打开聊天应用链接。
                                        </li>
                                        <li>
                                            点击 <IonIcon className="landing-inline-icon"
                                                          icon={ellipsisHorizontal}/> 菜单。
                                        </li>
                                        <li>选择“更多工具” {'>'} “应用” {'>'} “将此站点安装为应用”。</li>
                                        <li>自行选择将图标创建在任务栏、开始菜单或桌面。</li>
                                    </ol>
                                    <IonText color="medium">
                                        <p className="landing-card__note">
                                            如果浏览器在地址栏显示了 “安装 Wetty Chat 应用” 按钮，直接点安装即可
                                        </p>
                                    </IonText>
                                </IonCardContent>
                            </>
                        )}

                        {selectedPlatform === 'macos' && (
                            <>
                                <IonCardHeader>
                                    <IonCardSubtitle>推荐使用 <InlineLink
                                        icon={logoApple}>Safari</InlineLink>。</IonCardSubtitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <ol className="landing-card__steps">
                                        <li>
                                            在 <InlineLink icon={logoApple}>Safari</InlineLink> 中打开聊天应用链接。
                                        </li>
                                        <li>点击菜单栏“文件”。</li>
                                        <li>选择“添加到 Dock”。</li>
                                        <li>确认后即可像本地应用一样从 Dock 启动。</li>
                                    </ol>
                                    <IonText color="medium">
                                        <p className="landing-card__note">
                                            如果你的 <InlineLink
                                            icon={logoApple}>Safari</InlineLink> 版本较旧，看不到该选项，可以先升级系统或临时使用{' '}
                                            <InlineLink icon={logoChrome}>Chrome</InlineLink>/<InlineLink
                                            icon={logoWindows}>Edge</InlineLink>{' '}
                                            的安装功能。
                                        </p>
                                    </IonText>
                                </IonCardContent>
                            </>
                        )}

                        {selectedPlatform === 'linux' && (
                            <>
                                <IonCardHeader>
                                    <IonCardSubtitle>这点小问题想必难不住你。</IonCardSubtitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <ol className="landing-card__steps">
                                        <li>
                                            用支持 PWA 的浏览器打开聊天应用链接，比如 <InlineLink icon={logoChrome}>Chrome
                                            / Chromium</InlineLink>{' '}
                                            或 <InlineLink icon={logoWindows}>Edge</InlineLink>。
                                        </li>
                                        <li>
                                            查看地址栏右侧是否有安装图标；没有就打开右上角 <MenuDots/> 菜单。
                                        </li>
                                        <li>选择“安装应用”或“添加到桌面”。</li>
                                        <li>你的桌面环境会替你把剩下的事处理掉。</li>
                                    </ol>
                                </IonCardContent>
                            </>
                        )}
                    </IonCard>
                </section>
            </IonContent>
        </IonPage>
    );
}
