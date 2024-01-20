import { useMutation, useQuery, useQueryClient } from 'react-query';
import { onError } from '../../utils/error-handlers';
import useAxiosIns from '../../hooks/useAxiosIns';
import type { IReservation, IResponseData } from '../../types';
import { useState } from 'react';

export default ({ enabledFetchReservations }: { enabledFetchReservations: boolean }) => {
  const axios = useAxiosIns();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>();
  const bookReservationMutation = useMutation({
    mutationKey: ['book-reservation'],
    mutationFn: (reservation: IReservation) => axios.post<IResponseData<IReservation>>(`/reservation`, reservation),
    onSuccess: () => queryClient.invalidateQueries('reservations'),
    onError: onError,
  });

  const updateReservationMutation = useMutation({
    mutationKey: ['update-reservation'],
    mutationFn: ({ reservationId, reservation }: { reservationId: string; reservation: Partial<IReservation> }) =>
      axios.patch<IResponseData<IReservation>>(`/reservation?id=${reservationId}`, reservation),
    onSuccess: () => queryClient.invalidateQueries('reservations'),
    onError: onError,
  });

  const fetchReservationsQuery = useQuery({
    queryKey: ['reservations', filter],
    queryFn: () => axios.get<IResponseData<IReservation[]>>(`/reservation?filter=${filter}`),
    onError: onError,
    enabled: enabledFetchReservations,
    refetchIntervalInBackground: true,
    refetchInterval: 10000,
    select: res => res.data?.data,
  });

  const reservations = fetchReservationsQuery.data;

  return { reservations, bookReservationMutation, fetchReservationsQuery, updateReservationMutation, setFilter };
};
