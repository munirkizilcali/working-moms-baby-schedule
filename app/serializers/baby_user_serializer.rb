class BabyUserSerializer < ActiveModel::Serializer
  attributes :id, :care_taker_id, :baby_id, :role, :active
end
