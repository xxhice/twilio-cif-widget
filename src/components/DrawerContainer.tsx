import { Stack } from '@fluentui/react';
import {
  DrawerHeader,
  DrawerHeaderTitle,
  Drawer,
  DrawerProps,
  Button,
  Text,
  DrawerBody,
} from '@fluentui/react-components';
import { Dismiss24Regular } from '@fluentui/react-icons';
import React from 'react';
import { IResult } from '../interfaces/IResults';

interface DrawerContainerProps {
  children: React.ReactNode;
  onClose: () => void;
  toggle: boolean;
  headerText: string;
  result: IResult;
  renderBody?: () => JSX.Element;
}

type DrawerType = Required<DrawerProps>['type'];

const DrawerContainer = ({
  children,
  toggle,
  onClose,
  headerText,
  renderBody,
}: DrawerContainerProps) => {
  const [type] = React.useState<DrawerType>('overlay');

  return (
    <Stack verticalFill style={{ padding: 10, overflow: 'hidden', height: '100vh' }}>
      <Drawer type={type} separator open={toggle}>
        <DrawerHeader>
          <DrawerHeaderTitle
            action={
              <Button
                appearance="subtle"
                aria-label="Close"
                icon={<Dismiss24Regular />}
                onClick={onClose}
              />
            }
          >
            <Text size={500}>{headerText}</Text>
          </DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>{renderBody?.()}</DrawerBody>
      </Drawer>
      {children}
    </Stack>
  );
};

export default DrawerContainer;
