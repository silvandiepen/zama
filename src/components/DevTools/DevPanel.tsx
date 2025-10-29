import React from "react";
import { useBemm } from "@/utils/bemm";
import { useFeatureFlags } from "@/store/featureFlags";
import { useTheme } from "@/store/theme";
// internal dismiss button removed; closing handled by modal header
import { Checkbox } from "@/components/Input/Checkbox";
import { SwitchButton } from "@/components/Input/SwitchButton";
import { useLocale } from "@/store/locale";
import { useTranslation } from "react-i18next";
import "./devtools.scss";

type Props = {
  onClose?: () => void;
};

export const DevPanel: React.FC<Props> = ({ onClose: _onClose }) => {
  const bemm = useBemm("devtools");
  const { flags, setFlags } = useFeatureFlags();
  const { theme, toggleTheme, setTheme } = useTheme();
  const { lang, setLang } = useLocale();
  const { t } = useTranslation();

  return (
    <aside className={bemm("")}>

      <div className={bemm("section")}>
        <div className={bemm("section-title")}>{t('dev.theme')}</div>
        <p className={bemm("desc")}>{t('dev.themeDesc')}</p>
        <Checkbox
          label={"Enable color mode switcher"}
          checked={flags.enableColorModeSwitch}
          onChange={(e) => {
            const checked = e.currentTarget.checked;
            setFlags({ enableColorModeSwitch: checked });
            if (!checked) {
              // Enforce default theme when disabling switcher
              setTheme(flags.defaultTheme);
            }
          }}
        />
        {flags.enableColorModeSwitch ? (
          <SwitchButton
            label={t('dev.colorMode')}
            value={theme}
            onChange={() => toggleTheme()}
            options={[
              { value: "light", label: t('switch.light'), icon: "sun" },
              { value: "dark", label: t('switch.dark'), icon: "moon" },
            ]}
          />
        ) : (
          <SwitchButton
            label={"Default theme"}
            value={flags.defaultTheme}
            onChange={(v) => { setFlags({ defaultTheme: v as 'light' | 'dark' }); setTheme(v as 'light' | 'dark'); }}
            options={[
              { value: "light", label: t('switch.light'), icon: "sun" },
              { value: "dark", label: t('switch.dark'), icon: "moon" },
            ]}
          />
        )}
      </div>

      <div className={bemm("section")}>
        <div className={bemm("section-title")}>{t('dev.language')}</div>
        <p className={bemm("desc")}>{t('dev.languageDesc')}</p>
        <SwitchButton
          label={t('dev.language')}
          value={lang}
          onChange={(v) => setLang(v)}
          options={[
            { value: 'en', label: t('switch.en') },
            { value: 'nl', label: t('switch.nl') },
            { value: 'fr', label: t('switch.fr') },
          ]}
        />
      </div>

      <div className={bemm("section")}>
        <div className={bemm("section-title")}>{t('dev.featureFlags')}</div>
        <p className={bemm("desc")}>{t('dev.featureFlagsDesc')}</p>
        <Checkbox
          label={t('dev.enableDescriptions')}
          checked={flags.enableDescriptions}
          onChange={(e) => setFlags({ enableDescriptions: e.currentTarget.checked })}
        />
        <Checkbox
          label={t('dev.enableCopy')}
          checked={flags.enableCopy}
          onChange={(e) => setFlags({ enableCopy: e.currentTarget.checked })}
        />
        <Checkbox
          label={t('dev.enableRevoke')}
          checked={flags.enableRevoke}
          onChange={(e) => setFlags({ enableRevoke: e.currentTarget.checked })}
        />
        <Checkbox
          label={"Show user menu"}
          checked={flags.enableUserMenu}
          onChange={(e) => setFlags({ enableUserMenu: e.currentTarget.checked })}
        />
      </div>
    </aside>
  );
};
