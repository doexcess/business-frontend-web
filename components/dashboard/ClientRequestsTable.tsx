interface ClientRequest {
  id: string;
  name: string;
  date: string;
  content: string;
  status: string;
}

interface ClientRequestsTableProps {
  requests: ClientRequest[];
}

export function ClientRequestsTable({ requests }: ClientRequestsTableProps) {
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              S/N
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Client's Name
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Date
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Content
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Status
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {requests.map((request) => (
            <tr key={request.id}>
              <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900'>
                {request.id}
              </td>
              <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
                {request.name}
              </td>
              <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
                {request.date}
              </td>
              <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
                {request.content}
              </td>
              <td className='px-4 py-3 whitespace-nowrap'>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${
                    request.status === 'Completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {request.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
