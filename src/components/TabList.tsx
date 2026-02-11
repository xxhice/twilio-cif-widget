import {
  SelectTabEventHandler,
  Tab,
  TabList,
  makeStyles,
  shorthands,
} from '@fluentui/react-components';

import { TabListValues } from '../constants/TabListValues';

interface TabListProps {
  onTabSelect: SelectTabEventHandler;
  selectedValue: string;
}

const useStyles = makeStyles({
  root: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    ...shorthands.padding('10px', '20px'),
    rowGap: '20px',
  },
});

export const Default = (props: Partial<TabListProps>) => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <TabList
        {...props}
        onTabSelect={props.onTabSelect}
        selectedValue={props.selectedValue}
        size="large"
      >
        {/* <Tab value={TabListValues.HIA_TESTING}>HIA testing</Tab> */}
        <Tab value={TabListValues.TWILIO_AGENT}>Twilio Agent</Tab>
        {/* <Tab value={TabListValues.APIS}>Apis</Tab>
        <Tab value={TabListValues.EVENTHANDLERS}>Event handlers</Tab> */}
      </TabList>
    </div>
  );
};
