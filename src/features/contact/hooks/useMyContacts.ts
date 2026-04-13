import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../../context/AuthContext'
import { getUserContacts, createContact, deleteContact } from '../services/contactService'
import type { ContactItem } from '../interfaces/contact.interfaces'
import type { CreateContactDto } from '../dtos/create-contact.dto'

export function useMyContacts() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const key = ['contacts', 'user', user?.id]

  const query = useQuery({
    queryKey: key,
    queryFn: () => getUserContacts(user!.id),
    enabled: !!user,
  })

  const create = useMutation({
    mutationFn: (dto: CreateContactDto) => createContact(user!.id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key })
    },
  })

  const remove = useMutation({
    mutationFn: (contactId: string) => deleteContact(contactId),
    onSuccess: (_, contactId) => {
      qc.setQueryData<ContactItem[]>(key, (prev) =>
        prev?.filter((c) => c.id !== contactId)
      )
    },
  })

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    create,
    remove,
  }
}
