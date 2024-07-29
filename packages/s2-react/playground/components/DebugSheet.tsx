import { DataCell, drawCustomContent, type S2DataConfig } from '@antv/s2';
import React, { useEffect, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import {
  SheetComponent,
  type SheetComponentOptions,
} from '../../src/components';

function genData() {
  const chartRow = {
    province: {
      values: {
        type: 'interval',
        autoFit: true,
        data: [
          { x: 'a', val: 2 },
          { x: 'b', val: 3 },
          { x: 'c', val: 3 },
          { x: 'd', val: -3 },
        ],
        encode: { x: 'x', y: 'val' },
        axis: {
          y: {
            title: false,
            tick: false,
            line: false,
            label: false,
            grid: false,
          },
          x: { title: false, tick: false, line: false, label: false },
        },
        animate: {
          enter: { type: null },
          update: { type: null },
          exit: { type: null },
        },
        tooltip: null,
        margin: 0,
        padding: 0,
      },
    },
    city: {
      values: [
        ['a', 10],
        ['b', -10],
        ['c', 0],
        ['d', 101],
      ],
    },
  };

  const normalRow: any[] = [];

  for (let i = 0; i < 100; i++) {
    normalRow.push({
      province: '浙江' + i,
      city: '杭州' + i,
      type: '笔' + i,
      price: i,
    });
  }

  // return [chartRow, ...normalRow];
  return normalRow;
}

class CustomDataCell extends DataCell {
  drawTextShape() {
    if (this.isMultiData()) {
      const rcd = this.getRenderChartData();
      if (Array.isArray(rcd)) {
        return drawCustomContent(this);
      }

      return null;
    }

    super.drawTextShape();
  }
}

const DebugSheet: React.FC = () => {
  const [init, setInit] = useState<number>(0);
  const [s2DataConfig, setS2DataConfig] = useState<S2DataConfig>();
  const [s2Options, setS2Options] = useState<SheetComponentOptions>();

  const [checkedRowIndex, setCheckedRowIndex] = useState<number>(0);
  const [checkedColIndex, setCheckedColIndex] = useState<number>(0);

  useEffect(() => {
    if (init > 0) return;

    const s2dc = {
      fields: {
        columns: ['province', 'city', 'type', 'price', 'cost'],
      },
      meta: [
        { field: 'province', name: '省份' },
        { field: 'city', name: '城市' },
        { field: 'type', name: '商品类别' },
        { field: 'price', name: '价格' },
        { field: 'cost', name: '成本' },
      ],
      data: genData(),
    };

    const s2opt = {
      width: 600,
      height: 400,
      seriesNumber: { enable: true, text: '序号' },
      frozen: {
        rowCount: 1,
      },
      style: {
        rowCell: {
          heightByField: {
            '0': 100,
          },
          height: 24,
        },
      },
      // dataCell: (viewMeta: any, spreadsheet: any) => {
      //   return new CustomDataCell(viewMeta, spreadsheet);
      // },
    };

    setS2Options(s2opt);
    setS2DataConfig(s2dc);
    setInit(1);
  }, [init]);
  console.log('DebugSheet');

  // useEffect(() => {
  //   if (checkedRowIndex === 0) return;
  //   console.log(checkedRowIndex, 'checkedRowIndex/useEffect');
  //   console.log(s2Options, 's2Options/useEffect');

  //   const latestS2Options = {
  //     ...s2Options,
  //     conditions: {
  //       background: [
  //         {
  //           field: 'province',
  //           mapping(v, rawData, cell) {
  //             console.log(v, rawData, cell);

  //             return { fill: 'green' };
  //           },
  //         },
  //       ],
  //     },
  //   } as SheetComponentOptions;

  //   setS2Options(latestS2Options);
  // }, [checkedRowIndex]);

  return (
    <>
      {s2DataConfig && s2Options && (
        <SheetComponent
          sheetType="table"
          dataCfg={s2DataConfig}
          options={s2Options}
          themeCfg={{
            theme: {
              // splitLine: {
              //   shadowWidth: 0,
              //   horizontalBorderColor: 'white',
              // },
              dataCell: {
                cell: {
                  interactionState: {
                    selected: {
                      backgroundColor: '#ffe58f',
                      borderWidth: 2,
                      borderColor: 'red',
                    },
                  },
                },
              },
            },
          }}
          onDataCellClick={(cell) => {
            // console.log(cell, 'cell');
            const { viewMeta } = cell;
            const { rowIndex, colIndex } = viewMeta;

            unstable_batchedUpdates(() => {
              setCheckedRowIndex(rowIndex);
              setCheckedColIndex(colIndex);
            });
          }}
          // onDataCellRender={(cell) => {
          //   if (!cell.isChartData()) {
          //     return;
          //   }

          //   // 获取 G2 渲染到 S2 单元格内所需配置
          //   const chartOptions = cell.getRenderChartOptions();

          //   try {
          //     renderToMountedElement(chartOptions, {
          //       // 指定渲染容器为当前单元格
          //       group: cell,
          //       // 根据渲染的图表, 自行选择 G2 library: https://g2.antv.antgroup.com/manual/extra-topics/bundle#g2stdlib
          //       library: stdlib(),
          //     });
          //   } catch (e) {
          //     console.log(
          //       cell,
          //       chartOptions,
          //       e,
          //       'exception renderToMountedElement Step2ResultView',
          //     );
          //   }
          // }}
          onDataCellSelectMove={(metaList) => {
            // console.log(metaList, 'metaList/onDataCellSelectMove');
            if (metaList.length == 0) return;

            const cell = metaList[0] as any;

            unstable_batchedUpdates(() => {
              setCheckedRowIndex(cell['rowIndex']);
              setCheckedColIndex(cell['colIndex']);
            });
          }}
        />
      )}
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: '8px' }}>选中的行号：{checkedRowIndex}</div>
        <div>选中的列号：{checkedColIndex}</div>
      </div>
    </>
  );
};

export default DebugSheet;
