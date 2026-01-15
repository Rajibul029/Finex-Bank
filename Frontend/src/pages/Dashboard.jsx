import AccountDetails from "../components/AccountDetails";
import DepositForm from "../components/DepositForm";
import WithdrawForm from "../components/WithdrawForm";
import TransferForm from "../components/TransferForm";

export default function Dashboard() {
  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-screen bg-gray-950 text-white">
      <div className="col-span-1">
        <AccountDetails />
      </div>
      <div className="lg:col-span-2 space-y-6">
        <DepositForm />
        <WithdrawForm />
        <TransferForm />
      </div>
    </div>
  );
}
