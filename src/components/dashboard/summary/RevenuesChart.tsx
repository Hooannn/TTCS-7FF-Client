import { Card, Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
interface RevenuesChartProps {
  data:
    | {
        name: string;
        totalSales: number;
        totalUnits: number;
      }[]
    | undefined;
  loading?: boolean;
}
export default function RevenuesChart({ data, loading }: RevenuesChartProps) {
  const { t } = useTranslation();
  return (
    <Card
      loading={loading}
      title={
        <Row align="middle" justify="space-between">
          <Col>
            <h3>{t('revenues')}</h3>
          </Col>
        </Row>
      }
      style={{
        borderRadius: '12px',
        boxShadow: '0px 0px 16px rgba(17,17,26,0.1)',
      }}
    >
      <ResponsiveContainer width="100%" height={500}>
        <BarChart barSize={10} data={data} style={{ margin: '0 auto' }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" orientation="left" stroke="#8dbd75" />
          <YAxis yAxisId="right" orientation="right" stroke="#8884d8" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" name={t('total').toString() + ' (VND)'} dataKey="totalSales" fill="#8dbd75" />
          <Bar yAxisId="right" name={t('unit').toString()} dataKey="totalUnits" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
