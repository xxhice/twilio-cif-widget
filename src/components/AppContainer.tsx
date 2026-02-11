import {
  OnSelectionChangeData,
  SelectionItemId,
  Text,
  Tooltip,
} from '@fluentui/react-components';

import { ApiData } from '../data/ApiData';
import { ApiExecutionState } from '../constants/ApiExecutionState';
import { ApiResultStatus } from '../constants/ApiResultStatus';
import { ApiRunner } from '../apiRunner/ApiRunner';
import ApiTable from './ApiTable';
// import { Default as AppTablist } from './TabList';
import { CIFV2 } from '../cif/CIFV2';
import ConfigurationDrawer from './drawer/ConfigurationDrawer';
import DetailsDrawer from './drawer/DetailsDrawer';
import DrawerContainer from './DrawerContainer';
import { DrawerTypes } from '../constants/DrawerTypes';
import { EventHandlerData } from '../data/EventHandlerData';
import EventHandlerTable from './EventHandlerTable';
import { EventHandlerUniqueNames } from '../constants/EventHandlerUniqueNames';
import HIATestingPanel from './HIATestingPanel';
import TwilioAgentPanel from './TwilioAgentPanel';
import { IApiData } from '../interfaces/IApiData';
import { IApiExecutionResult } from '../interfaces/IApiExecutionResult';
import { IApiItem } from '../interfaces/IApiItem';
import { IEventHandlerData } from '../interfaces/IEventHandlerData';
import { IEventHandlerItem } from '../interfaces/IEventHandlerItem';
import { IResult } from '../interfaces/IResults';
import React from 'react';
import { Settings24Regular } from '@fluentui/react-icons';
import { Stack } from '@fluentui/react';
import { Strings } from '../constants/Strings';
import { TabListValues } from '../constants/TabListValues';
import ToolBar from './ToolBar';
import { Utils } from '../common/utility/Utils';

interface IAppContainerProps {
  darkMode: boolean;
  onDarkModeToggle: (value: boolean) => void;
}

const AppContainer = ({ darkMode, onDarkModeToggle }: IAppContainerProps) => {
  const [selectedItems, setSelectedItems] = React.useState<
    Set<SelectionItemId>
  >(new Set());
  const [apiItems, setApiItems] = React.useState<Array<IApiItem>>([]);
  const [eventHandlerItems, setEventHandlerItems] = React.useState<
    Array<IEventHandlerItem>
  >([]);
  const [apiRunner] = React.useState<ApiRunner>(new ApiRunner());
  const [currentTab, setCurrentTab] = React.useState<string>(
    TabListValues.TWILIO_AGENT
  );
  const [drawerToggleState, setDrawerToggleState] = React.useState(false);
  const [drawerType, setDrawerType] = React.useState<DrawerTypes | null>(null);
  const [selectedRowItemIndex, setSelectedRowItemIndex] = React.useState<
    number | null
  >(null);

  const setHandlerResult = React.useCallback(
    (uniqueName: string, result: IResult) => {
      setEventHandlerItems((prevItems: Array<IEventHandlerItem>) => {
        return prevItems.map((item: IEventHandlerItem): IEventHandlerItem => {
          if (item.uniqueName === uniqueName) {
            return { ...item, result: result };
          }

          return item;
        });
      });
    },
    []
  );

  React.useEffect(() => {
    const apiItems = ApiData.apiItems.map(
      (item: IApiData): IApiItem => ({ ...item, state: ApiExecutionState.NEW })
    );
    const eventHandlerItems = EventHandlerData.eventHandlerItems.map(
      (item: IEventHandlerData): IEventHandlerItem => {
        return { ...item };
      }
    );

    // ON SESSION SWITCHED HANDLER
    CIFV2.getInstance().addHandler(
      EventHandlerUniqueNames.ON_SESSION_SWITCHED,
      (eventData: string): Promise<void> => {
        const response = JSON.parse(eventData);
        setHandlerResult(EventHandlerUniqueNames.ON_SESSION_SWITCHED, {
          value: eventData,
          simpleDisplayValue: response.sessionId,
        });
        return Promise.resolve();
      }
    );

    // ON SESSION CLOSED HANDLER
    CIFV2.getInstance().addHandler(
      EventHandlerUniqueNames.ON_SESSION_CLOSED,
      (eventData: string): Promise<void> => {
        const response = JSON.parse(eventData);
        setHandlerResult(EventHandlerUniqueNames.ON_SESSION_CLOSED, {
          value: eventData,
          simpleDisplayValue: response.sessionId,
        });
        return Promise.resolve();
      }
    );

    // ON MODE CHANGED HANDLER
    CIFV2.getInstance().addHandler(
      EventHandlerUniqueNames.ON_MODE_CHANGE,
      (eventData: string): Promise<void> => {
        const response = JSON.parse(eventData);
        setHandlerResult(EventHandlerUniqueNames.ON_MODE_CHANGE, {
          value: eventData,
          simpleDisplayValue: response.value,
        });
        return Promise.resolve();
      }
    );

    // ON SIZE CHANGED HANDLER
    CIFV2.getInstance().addHandler(
      EventHandlerUniqueNames.ON_SIZE_CHANGE,
      (eventData: string): Promise<void> => {
        const response = JSON.parse(eventData);
        setHandlerResult(EventHandlerUniqueNames.ON_SIZE_CHANGE, {
          value: eventData,
          simpleDisplayValue: response.value,
        });
        return Promise.resolve();
      }
    );

    // ON CLICK TO ACT HANDLER
    CIFV2.getInstance().addHandler(
      EventHandlerUniqueNames.ON_CLICK_TO_ACT,
      (eventData: string): Promise<void> => {
        const response = JSON.parse(eventData);
        setHandlerResult(EventHandlerUniqueNames.ON_CLICK_TO_ACT, {
          value: eventData,
          simpleDisplayValue: response.value,
        });
        return Promise.resolve();
      }
    );

    // ON PRESENCE CHANGE HANDLER
    CIFV2.getInstance().addHandler(
      EventHandlerUniqueNames.ON_PRESENCE_CHANGE,
      (eventData: string): Promise<void> => {
        const response = JSON.parse(eventData);
        setHandlerResult(EventHandlerUniqueNames.ON_PRESENCE_CHANGE, {
          value: eventData,
          simpleDisplayValue: response.presenceInfo.presenceText,
        });
        return Promise.resolve();
      }
    );

    setApiItems(apiItems);
    setEventHandlerItems(eventHandlerItems);
  }, [setHandlerResult]);

  const onMultiSelectChange = React.useCallback(
    (data: OnSelectionChangeData) => {
      setSelectedItems(data.selectedItems);
    },
    []
  );

  const setItemState = React.useCallback(
    (uniqueName: string, newState: ApiExecutionState) => {
      setApiItems((prevItems: Array<IApiItem>) => {
        return prevItems.map((item: IApiItem): IApiItem => {
          if (item.uniqueName === uniqueName) {
            return { ...item, state: newState };
          }

          return item;
        });
      });
    },
    []
  );

  const setItemResult = React.useCallback(
    (uniqueName: string, result: IResult) => {
      setApiItems((prevItems: Array<IApiItem>) => {
        return prevItems.map((item: IApiItem): IApiItem => {
          if (item.uniqueName === uniqueName) {
            return { ...item, result: result };
          }

          return item;
        });
      });
    },
    []
  );

  // const onTabSwitch: SelectTabEventHandler = (
  //   _event: SelectTabEvent,
  //   data: SelectTabData
  // ) => {
  //   setCurrentTab(data.value as string);
  //   selectedItems.clear();
  //   setSelectedItems(new Set());
  // };

  const onEventHandlerRowClick = React.useCallback(
    (rowItem: IEventHandlerItem) => {
      const selectedIndex = eventHandlerItems.findIndex(
        (items) => items.uniqueName === rowItem.uniqueName
      );
      setSelectedRowItemIndex(selectedIndex);
      setDrawerType(DrawerTypes.DETAILS);
      setDrawerToggleState(true);
    },
    [eventHandlerItems]
  );

  const onDrawerClose = React.useCallback(() => {
    setDrawerToggleState(false);
  }, []);

  const onDetailsClick = React.useCallback(() => {
    setDrawerType(DrawerTypes.DETAILS);
    setDrawerToggleState(true);
  }, []);

  const onRunClick = React.useCallback(() => {
    if (!Utils.isCIFAvailable()) {
      alert('CIF is not available to run APIs!');
      return;
    }
    const selectedItemsArray = apiItems.filter(
      (_item: IApiItem, index: number) => {
        // selected item ids are indexed based
        if (selectedItems.has(index)) {
          return true;
        }

        return false;
      }
    );

    selectedItems.clear();
    setSelectedItems(new Set());

    // run api executions
    selectedItemsArray.forEach((item: IApiItem) => {
      if (!apiRunner.isApiQueued(item.uniqueName)) {
        setItemState(item.uniqueName, ApiExecutionState.QUEUED);
        apiRunner.queueApi(item.uniqueName, {
          onStarted: () => {
            setItemState(item.uniqueName, ApiExecutionState.INPROGRESS);
          },
          onComplete: (executionResult: IApiExecutionResult) => {
            if (executionResult.status === ApiResultStatus.RESOLVED) {
              setItemState(item.uniqueName, ApiExecutionState.SUCCESS);
            } else {
              setItemState(item.uniqueName, ApiExecutionState.FAILED);
            }

            setItemResult(item.uniqueName, executionResult.result as IResult);
          },
          onFailure: (error) => {
            setItemState(item.uniqueName, ApiExecutionState.FAILED);
            setItemResult(item.uniqueName, {
              error: error as Error,
            } as IResult);
            return { status: ApiResultStatus.FAILED } as IApiExecutionResult;
          },
        });
      }
    });
  }, [selectedItems, apiItems, apiRunner, setItemState, setItemResult]);

  const selectedItemId = selectedItems.values().next().value;

  const renderCurrentTab = () => {
    switch (currentTab) {
      case TabListValues.HIA_TESTING:
        return <HIATestingPanel />;
      case TabListValues.TWILIO_AGENT:
        return <TwilioAgentPanel />;
      case TabListValues.APIS:
        return (
          <ApiTable
            data={apiItems}
            onMultiSelectChange={onMultiSelectChange}
          />
        );
      case TabListValues.EVENTHANDLERS:
        return (
          <EventHandlerTable
            data={eventHandlerItems}
            onRowClick={onEventHandlerRowClick}
          />
        );
      default:
        return <HIATestingPanel />;
    }
  };

  const shouldShowToolbar = () => {
    return currentTab === TabListValues.APIS;
  };

  return (
    <DrawerContainer
      onClose={onDrawerClose}
      renderBody={() => {
        return drawerType === DrawerTypes.DETAILS ? (
          <DetailsDrawer
            result={
              apiItems[selectedItemId]?.result ??
              eventHandlerItems[selectedRowItemIndex ?? -1]?.result
            }
          ></DetailsDrawer>
        ) : (
          <ConfigurationDrawer
            setGlobalAPIContext={apiRunner.setGlobalAPIContext}
            darkMode={darkMode}
            onDarkModeToggle={onDarkModeToggle}
          ></ConfigurationDrawer>
        );
      }}
      toggle={drawerToggleState}
      result={apiItems[selectedItemId]?.result as IResult}
      headerText={
        drawerType === DrawerTypes.DETAILS
          ? `${
              apiItems[selectedItemId]?.name ??
              eventHandlerItems[selectedRowItemIndex ?? -1]?.name
            } - ${Strings.DRAWER_DETAILS_HEADER_TEXT}`
          : Strings.DRAWER_CONFIGURATION_HEADER_TEXT
      }
    >
      <Stack verticalFill style={{ overflow: 'hidden' }}>
        {/* <Stack.Item>
          <AppTablist selectedValue={currentTab} onTabSelect={onTabSwitch} />
        </Stack.Item> */}
        <Stack.Item grow style={{ overflow: 'hidden', height: '100%' }}>
          {renderCurrentTab()}
        </Stack.Item>
        {shouldShowToolbar() && (
          <Stack.Item>
            <ToolBar
              showRunButton={selectedItems.size > 0}
              showDetailsButton={selectedItems.size === 1}
              hintText={
                selectedItems.size === 0
                  ? 'Select APIs to run'
                  : `${selectedItems.size} API(s) selected`
              }
              onRunClick={onRunClick}
              onDetailsClick={onDetailsClick}
            />
          </Stack.Item>
        )}
      </Stack>
    </DrawerContainer>
  );
};

export default AppContainer;
