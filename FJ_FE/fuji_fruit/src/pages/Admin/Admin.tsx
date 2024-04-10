import BuyerProfilePieChart from 'src/components/BuyerProfilePieChart'
import DashboardStatsGrid from 'src/components/DashboardStatsGrid'
import PopularProducts from 'src/components/PopularProducts'
import RecentOrders from 'src/components/RecentOrders'
import TransactionChart from 'src/components/TransactionChart'

export default function Admin() {
  return (
    <div className='flex flex-col gap-4'>
      <DashboardStatsGrid />
      <div className='flex flex-row gap-4 w-full'>
        <TransactionChart />
        <BuyerProfilePieChart />
      </div>
      <div className='flex flex-row gap-4 w-full'>
        <RecentOrders />
        <PopularProducts />
      </div>
    </div>
  )
}
