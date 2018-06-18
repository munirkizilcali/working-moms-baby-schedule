class EventSerializer < ActiveModel::Serializer
  attributes :id, :baby_id, :user_id, :amount_1, :amount_2, :type, :notes
  belongs_to :user 
  belongs_to :baby
end
