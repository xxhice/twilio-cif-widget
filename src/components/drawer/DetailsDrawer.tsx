import { Stack } from '@fluentui/react';
import { Field, Textarea, Text } from '@fluentui/react-components';
import { IResult } from '../../interfaces/IResults';
import { Strings } from '../../constants/Strings';

interface DetailsDrawerProps {
  result?: IResult;
}

const DetailsDrawer = (props: DetailsDrawerProps) => {
  return (
    <Stack verticalFill tokens={{ childrenGap: 10 }}>
      {props.result?.value && (
        <Field label="Result JSON" size="medium">
          <Textarea resize={'vertical'} readOnly value={props.result.value} />
        </Field>
      )}
      {props.result?.error && (
        <Field label="Error" size="medium">
          <Textarea
            resize={'vertical'}
            readOnly
            value={props.result.error?.message}
          />
        </Field>
      )}
      {props.result?.timeStamp && (
        <Field label="Time Stamp" size="medium">
          <Textarea
            resize={'vertical'}
            readOnly
            value={props.result?.timeStamp?.toString()}
          />
        </Field>
      )}
      {props.result?.duration && (
        <Field label="Duration (ms)" size="medium">
          <Textarea
            resize={'vertical'}
            readOnly
            value={props.result.duration.toString()}
          />
        </Field>
      )}
      {props.result?.correlationId && (
        <Field label="CorrelationId" size="medium">
          <Textarea
            resize={'vertical'}
            readOnly
            value={props.result.correlationId}
          />
        </Field>
      )}

      {!props.result && (
        <Stack.Item
          styles={{
            root: {
              display: 'flex',
              height: 'calc(100% - 53px)',
              justifyContent: 'center',
              alignItems: 'center',
            },
          }}
        >
          <Text size={400}>{Strings.EMPTY_DRAWER}</Text>
        </Stack.Item>
      )}
    </Stack>
  );
};

export default DetailsDrawer;
