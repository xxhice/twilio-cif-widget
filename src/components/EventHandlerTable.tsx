import React from 'react';
import {
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  TableColumnDefinition,
  createTableColumn,
  Text,
} from '@fluentui/react-components';
import { IEventHandlerItem } from '../interfaces/IEventHandlerItem';
import { Styles } from '../constants/Styles';
import { Strings } from '../constants/Strings';
import './../css/styles.css';

interface IEventHandlerTableProps {
  data: IEventHandlerItem[];
  onRowClick: (rowItem: IEventHandlerItem) => void;
}

const EventHandlerTable: React.FC<IEventHandlerTableProps> = (
  props: IEventHandlerTableProps
) => {
  const columns: TableColumnDefinition<IEventHandlerItem>[] = [
    createTableColumn<IEventHandlerItem>({
      columnId: 'name',
      renderHeaderCell: () => 'Name',
      renderCell: (item) => (
        <Text style={{ fontSize: Styles.GRID_TEXT_SIZE }}>{item.name}</Text>
      ),
    }),
    createTableColumn<IEventHandlerItem>({
      columnId: 'result',
      renderHeaderCell: () => 'Event Result',
      renderCell: (item: IEventHandlerItem) => {
        if (!item.result?.simpleDisplayValue) {
          return (
            <Text className="dots" style={{ fontSize: Styles.GRID_TEXT_SIZE }}>
              {Strings.LISTENING_TEXT}
            </Text>
          );
        }

        return item.result.simpleDisplayValue;
      },
    }),
  ];

  return (
    <DataGrid
      items={props.data}
      columns={columns}
      sortable
      focusMode="composite"
    >
      <DataGridHeader>
        <DataGridRow>
          {({ renderHeaderCell }) => (
            <DataGridHeaderCell style={{ fontSize: Styles.GRID_HEADER_SIZE }}>
              {renderHeaderCell()}
            </DataGridHeaderCell>
          )}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<IEventHandlerItem>>
        {({ item }) => (
          <DataGridRow<IEventHandlerItem>
            style={{ cursor: 'pointer' }}
            key={item.uniqueName}
            onClick={() => props.onRowClick(item)}
          >
            {({ renderCell }) => (
              <DataGridCell>{renderCell(item)}</DataGridCell>
            )}
          </DataGridRow>
        )}
      </DataGridBody>
    </DataGrid>
  );
};

export default EventHandlerTable;
