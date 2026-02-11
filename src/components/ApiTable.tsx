import React from 'react';
import {
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  OnSelectionChangeData,
  TableColumnDefinition,
  Tooltip,
  createTableColumn,
  Text,
} from '@fluentui/react-components';
import { IApiItem } from '../interfaces/IApiItem';
import { ApiExecutionState } from '../constants/ApiExecutionState';
import { Checkmark20Filled, ErrorCircle20Filled } from '@fluentui/react-icons';
import { Spinner } from '@fluentui/react-components';
import { Styles } from '../constants/Styles';
import { Strings } from '../constants/Strings';

interface IApiTableProps {
  onMultiSelectChange: (data: OnSelectionChangeData) => void;
  data: IApiItem[];
}

const ApiTable: React.FC<IApiTableProps> = (props: IApiTableProps) => {
  const columns: TableColumnDefinition<IApiItem>[] = [
    createTableColumn<IApiItem>({
      columnId: 'name',
      renderHeaderCell: () => 'Name',
      renderCell: (item) => item.name,
    }),
    createTableColumn<IApiItem>({
      columnId: 'status',
      renderHeaderCell: () => 'Status',
      renderCell: (item: IApiItem) => {
        let cellJSX = <></>;
        if (item.state === ApiExecutionState.QUEUED) {
          cellJSX = (
            <Text style={{ fontSize: Styles.GRID_TEXT_SIZE }}>
              {Strings.QUEUED}
            </Text>
          );
        } else if (item.state === ApiExecutionState.INPROGRESS) {
          cellJSX = <Spinner size={'extra-tiny'}></Spinner>;
        } else if (item.state === ApiExecutionState.SUCCESS) {
          cellJSX = (
            <Tooltip content="Success" relationship="description">
              <Checkmark20Filled
                style={{
                  height: Styles.GRID_ICON_SIZE,
                  width: Styles.GRID_ICON_SIZE,
                }}
              />
            </Tooltip>
          );
        } else if (item.state === ApiExecutionState.FAILED) {
          cellJSX = (
            <Tooltip content="Error" relationship="description">
              <ErrorCircle20Filled
                style={{
                  height: Styles.GRID_ICON_SIZE,
                  width: Styles.GRID_ICON_SIZE,
                }}
              />
            </Tooltip>
          );
        }

        return cellJSX;
      },
    }),
  ];

  return (
    <DataGrid
      style={{ overflow: 'auto' }}
      items={props.data}
      columns={columns}
      sortable
      selectionMode="multiselect"
      focusMode="composite"
      onSelectionChange={(
        _e:
          | React.MouseEvent<Element, MouseEvent>
          | React.KeyboardEvent<Element>,
        data: OnSelectionChangeData
      ) => {
        props.onMultiSelectChange(data);
      }}
    >
      <DataGridHeader>
        <DataGridRow
          selectionCell={{
            checkboxIndicator: { 'aria-label': 'Select all rows' },
          }}
        >
          {({ renderHeaderCell }) => (
            <DataGridHeaderCell style={{ fontSize: Styles.GRID_HEADER_SIZE }}>
              {renderHeaderCell()}
            </DataGridHeaderCell>
          )}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<IApiItem>>
        {({ item }) => (
          <DataGridRow<IApiItem>
            style={{ cursor: 'pointer' }}
            key={item.uniqueName}
            selectionCell={{
              checkboxIndicator: { 'aria-label': 'Select row' },
            }}
          >
            {({ renderCell }) => (
              <DataGridCell style={{ fontSize: Styles.GRID_TEXT_SIZE }}>
                {renderCell(item)}
              </DataGridCell>
            )}
          </DataGridRow>
        )}
      </DataGridBody>
    </DataGrid>
  );
};

export default ApiTable;
