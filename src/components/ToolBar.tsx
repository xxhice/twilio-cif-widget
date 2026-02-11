import { Toolbar, ToolbarButton, Tooltip } from '@fluentui/react-components';
import React from 'react';
import { Play48Regular, SlideSearch24Regular } from '@fluentui/react-icons';
import { Text } from '@fluentui/react-components';
import { Styles } from '../constants/Styles';

interface IToolBarProps {
  showRunButton: boolean;
  showDetailsButton: boolean;
  hintText: string;
  onRunClick: () => void;
  onDetailsClick: () => void;
  hidden?: boolean;
}

const ToolBar: React.FC<IToolBarProps> = (props: IToolBarProps) => {
  const showText = !props.showRunButton && !props.showDetailsButton;
  
  if (props.hidden) {
    return null;
  }

  return (
    <Toolbar
      size="medium"
      style={{
        padding: 0,
        minHeight: '40px',
        justifyContent: showText ? 'center' : 'flex-start',
      }}
    >
      {props.showRunButton && (
        <Tooltip
          content="Run Selected APIs"
          relationship="description"
          withArrow
        >
          <ToolbarButton
            aria-label="Play"
            icon={<Play48Regular onClick={props.onRunClick} />}
          />
        </Tooltip>
      )}

      {props.showDetailsButton && (
        <Tooltip content="Show Details" relationship="description" withArrow>
          <ToolbarButton
            aria-label="Details"
            icon={<SlideSearch24Regular onClick={props.onDetailsClick} />}
          />
        </Tooltip>
      )}

      {showText && (
        <Text style={{ marginLeft: 5, fontSize: Styles.HELPER_TEXT_SIZE }}>
          {props.hintText}
        </Text>
      )}
    </Toolbar>
  );
};

export default ToolBar;
