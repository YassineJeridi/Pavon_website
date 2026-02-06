// frontend/src/components/dashboard/contacts/ContactList.jsx

import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/solid';
import { ClockIcon } from '@heroicons/react/24/outline';

const ContactList = ({ contacts, selectedContact, onSelectContact, formatDate }) => {
    if (contacts.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <EnvelopeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">Aucun message trouvé</p>
                <p className="text-gray-400 text-sm mt-1">Les messages de contact apparaîtront ici</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-100">
                {contacts.map((contact) => (
                    <div
                        key={contact._id}
                        onClick={() => onSelectContact(contact)}
                        className={`p-5 cursor-pointer transition-all hover:bg-gray-50 ${selectedContact?._id === contact._id
                                ? 'bg-[#fdf9ee] border-l-4 border-[#5d1115]'
                                : !contact.read
                                    ? 'bg-blue-50/30 border-l-4 border-[#111f35]'
                                    : ''
                            }`}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
                                    {!contact.read && (
                                        <span className="flex-shrink-0 w-2 h-2 bg-[#111f35] rounded-full"></span>
                                    )}
                                </div>
                                <div className="flex items-center text-sm text-gray-600 gap-3">
                                    <div className="flex items-center gap-1">
                                        <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                                        <span className="truncate">{contact.email}</span>
                                    </div>
                                    {contact.phone && (
                                        <div className="flex items-center gap-1">
                                            <PhoneIcon className="w-4 h-4 text-gray-400" />
                                            <span>{contact.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{contact.message}</p>

                        <div className="flex items-center text-xs text-gray-500">
                            <ClockIcon className="w-3.5 h-3.5 mr-1" />
                            {formatDate(contact.createdAt)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContactList;
