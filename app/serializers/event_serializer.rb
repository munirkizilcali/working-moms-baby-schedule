class EventSerializer < ActiveModel::Serializer
  attributes :id, :baby_id, :user_id, :event_type, :amount_1, :amount_2, :notes
end
