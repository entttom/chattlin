# == Schema Information
#
# Table name: channel_twilio_sms
#
#  id           :bigint           not null, primary key
#  account_sid  :string           not null
#  auth_token   :string           not null
#  medium       :integer          default("sms")
#  phone_number :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  account_id   :integer          not null
#
# Indexes
#
#  index_channel_twilio_sms_on_account_sid_and_phone_number  (account_sid,phone_number) UNIQUE
#  index_channel_twilio_sms_on_phone_number                  (phone_number) UNIQUE
#

class Channel::TwilioSms < ApplicationRecord
  include Channelable

  self.table_name = 'channel_twilio_sms'

  validates :account_sid, presence: true
  validates :auth_token, presence: true
  # NOTE: allowing nil for future when we suppor twilio messaging services
  # https://github.com/entttom/chattlin/pull/4242
  validates :phone_number, uniqueness: true, allow_nil: true

  enum medium: { sms: 0, whatsapp: 1 }

  def name
    medium == 'sms' ? 'Twilio SMS' : 'Whatsapp'
  end

  def has_24_hour_messaging_window?
    medium == 'whatsapp'
  end
end
