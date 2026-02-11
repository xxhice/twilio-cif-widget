import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Dropdown,
  Switch,
  useId,
  Option,
  makeStyles,
} from '@fluentui/react-components';
import { Strings } from '../../constants/Strings';
import { GlobalStore } from '../../common/GlobalStore/GlobalStore';
import { useMemo } from 'react';
import { GlobalStoreParameters } from '../../common/GlobalStore/GlobalStoreParameters';
import { ISessionTemplate } from '../../interfaces/ISessionTemplate';
import { INotificationTemplate } from '../../interfaces/INotificationTemplate';
import { LocalStorageConstants } from '../../constants/LocalStorageConstants';
import { IApplicationTabTemplate } from '../../interfaces/IApplicationTabTemplate';

interface ConfigurationDrawerProps {
  darkMode: boolean;
  onDarkModeToggle: (value: boolean) => void;
  customJSX?: JSX.Element;
  setGlobalAPIContext: (key: string, value: string) => void;
}

const useStyles = makeStyles({
  listbox: {
    maxHeight: '150px',
  },
});

const ConfigurationDrawer = (props: ConfigurationDrawerProps) => {
  const sessionTemplateSelectId = useId();
  const notificationTemplateSelectId = useId();
  const tabTemplateSelectId = useId();
  const sessionTemplateMap: Map<string, ISessionTemplate> = useMemo(
    () =>
      GlobalStore.getInstance().get(
        GlobalStoreParameters.LOADED_SESSION_TEMPLATES
      ) as Map<string, ISessionTemplate>,
    []
  );
  const notificationTemplateMap: Map<string, INotificationTemplate> = useMemo(
    () =>
      GlobalStore.getInstance().get(
        GlobalStoreParameters.LOADED_NOTIFICATION_TEMPLATES
      ) as Map<string, INotificationTemplate>,
    []
  );
  const tabTemplateMap: Map<string, IApplicationTabTemplate> = useMemo(
    () =>
      GlobalStore.getInstance().get(
        GlobalStoreParameters.LOADED_APPLICATION_TEMPLATES
      ) as Map<string, IApplicationTabTemplate>,
    []
  );

  const sortedAllSessionTemplates = useMemo(
    () => Array.from(sessionTemplateMap?.values() ?? []),
    [sessionTemplateMap]
  );
  const sortedAllNotificationTemplates = useMemo(
    () => Array.from(notificationTemplateMap?.values() ?? []),
    [notificationTemplateMap]
  );
  const sortedAllTabTemplates = useMemo(
    () => Array.from(tabTemplateMap?.values() ?? []),
    [tabTemplateMap]
  );

  const defaultSessionTemplate: ISessionTemplate = useMemo(
    () =>
      GlobalStore.getInstance().get(
        GlobalStoreParameters.SESSION_TEMPLATE
      ) as ISessionTemplate,
    []
  );

  const defaultNotificationTemplate: INotificationTemplate = useMemo(
    () =>
      GlobalStore.getInstance().get(
        GlobalStoreParameters.NOTIFICATION_TEMPLATE
      ) as INotificationTemplate,
    []
  );

  const defaultTabTemplate: IApplicationTabTemplate = useMemo(
    () =>
      GlobalStore.getInstance().get(
        GlobalStoreParameters.APPLICATION_TEMPLATE
      ) as IApplicationTabTemplate,
    []
  );
  const styles = useStyles();

  return (
    <Accordion>
      <AccordionItem value="1">
        <AccordionHeader>Themes</AccordionHeader>
        <AccordionPanel>
          <Switch
            checked={props.darkMode}
            onChange={(value) => {
              props.onDarkModeToggle(value.target.checked);
              GlobalStore.getInstance().save(
                GlobalStoreParameters.DARK_MODE,
                value.target.checked
              );
              localStorage.setItem(
                LocalStorageConstants.DARK_MODE,
                value.target.checked.toString()
              );
            }}
            label={props.darkMode ? Strings.DARK_MODE : Strings.LIGHT_MODE}
          />
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="2">
        <AccordionHeader>Create Session</AccordionHeader>
        <AccordionPanel>
          <>
            <label style={{ fontSize: 12 }} htmlFor={sessionTemplateSelectId}>
              {Strings.SESSION_TEMPLATE}
            </label>
            <Dropdown
              listbox={{ className: styles.listbox }}
              id={sessionTemplateSelectId}
              defaultValue={defaultSessionTemplate?.name}
              defaultSelectedOptions={[defaultSessionTemplate?.uniqueName]}
              onOptionSelect={(_event, data) => {
                const currentTemplate = sessionTemplateMap.get(
                  data?.optionValue || ''
                );
                GlobalStore.getInstance().save(
                  GlobalStoreParameters.SESSION_TEMPLATE,
                  currentTemplate
                );
                localStorage.setItem(
                  LocalStorageConstants.SESSION_TEMPLATE,
                  currentTemplate?.uniqueName || ''
                );
              }}
            >
              {sortedAllSessionTemplates?.map((template: ISessionTemplate) => {
                return (
                  <Option
                    key={template.uniqueName}
                    value={template.uniqueName}
                    text={template.name}
                  >
                    {template.name}
                  </Option>
                );
              })}
            </Dropdown>
          </>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="3">
        <AccordionHeader>Create Tab</AccordionHeader>
        <AccordionPanel>
          <>
            <label style={{ fontSize: 12 }} htmlFor={tabTemplateSelectId}>
              {Strings.TAB_TEMPLATE}
            </label>
            <Dropdown
              listbox={{ className: styles.listbox }}
              id={tabTemplateSelectId}
              defaultValue={defaultTabTemplate?.name}
              defaultSelectedOptions={[defaultTabTemplate?.uniqueName]}
              onOptionSelect={(_event, data) => {
                const currentTemplate = tabTemplateMap.get(
                  data?.optionValue || ''
                );
                GlobalStore.getInstance().save(
                  GlobalStoreParameters.APPLICATION_TEMPLATE,
                  currentTemplate
                );
                localStorage.setItem(
                  LocalStorageConstants.APPLICATION_TEMPLATE,
                  currentTemplate?.uniqueName || ''
                );
              }}
            >
              {sortedAllTabTemplates?.map(
                (template: IApplicationTabTemplate) => {
                  return (
                    <Option
                      key={template.uniqueName}
                      value={template.uniqueName}
                      text={template.name}
                    >
                      {template.name}
                    </Option>
                  );
                }
              )}
            </Dropdown>
          </>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="4">
        <AccordionHeader>Notify Event</AccordionHeader>
        <AccordionPanel>
          <>
            <label
              style={{ fontSize: 12 }}
              htmlFor={notificationTemplateSelectId}
            >
              {Strings.NOTIFICATION_TEMPLATE}
            </label>
            <Dropdown
              listbox={{ className: styles.listbox }}
              id={notificationTemplateSelectId}
              defaultValue={defaultNotificationTemplate?.name}
              defaultSelectedOptions={[defaultNotificationTemplate?.uniqueName]}
              onOptionSelect={(_event, data) => {
                const currentTemplate = notificationTemplateMap.get(
                  data?.optionValue || ''
                );
                GlobalStore.getInstance().save(
                  GlobalStoreParameters.NOTIFICATION_TEMPLATE,
                  currentTemplate
                );
                localStorage.setItem(
                  LocalStorageConstants.NOTIFICATION_TEMPLATE,
                  currentTemplate?.uniqueName || ''
                );
              }}
            >
              {sortedAllNotificationTemplates?.map(
                (template: INotificationTemplate) => {
                  return (
                    <Option
                      key={template.uniqueName}
                      value={template.uniqueName}
                      text={template.name}
                    >
                      {template.name}
                    </Option>
                  );
                }
              )}
            </Dropdown>
          </>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default ConfigurationDrawer;
