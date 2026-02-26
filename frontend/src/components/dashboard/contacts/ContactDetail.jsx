// frontend/src/components/dashboard/contacts/ContactDetail.jsx

import { EnvelopeIcon, PhoneIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const ContactDetail = ({ contact, onDelete, formatDate }) => {
    if (!contact) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center h-full flex items-center justify-center">
                <div>
                    <EnvelopeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">Sélectionnez un message</p>
                    <p className="text-gray-400 text-sm mt-1">Les détails apparaîtront ici</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#5d1115] to-[#7d1519] p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white mb-2">{contact.name}</h2>
                        <div className="flex items-center gap-2">
                            {contact.read ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                                    Lu
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#111f35] text-white">
                                    Nouveau
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => onDelete(contact._id)}
                        className="p-2.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <TrashIcon className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>

            {/* Contact Info */}
            <div className="p-6 border-b border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-[#fdf9ee] rounded-lg">
                            <EnvelopeIcon className="w-5 h-5 text-[#5d1115]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-500 mb-1">Email</p>
                            <a
                                href={`mailto:${contact.email}`}
                                className="text-sm font-medium text-[#5d1115] hover:underline break-all"
                            >
                                {contact.email}
                            </a>
                        </div>
                    </div>

                    {contact.phone && (
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-[#fdf9ee] rounded-lg">
                                <PhoneIcon className="w-5 h-5 text-[#5d1115]" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-medium text-gray-500 mb-1">Téléphone</p>
                                <a
                                    href={`tel:${contact.phone}`}
                                    className="text-sm font-medium text-[#5d1115] hover:underline"
                                >
                                    {contact.phone}
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                        Reçu le <span className="font-medium text-gray-700">{formatDate(contact.createdAt)}</span>
                    </p>
                </div>
            </div>

            {/* Message Content */}
            <div className="p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Message</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{contact.message}</p>
                </div>
            </div>
        </div>
    );
};

export default ContactDetail;
